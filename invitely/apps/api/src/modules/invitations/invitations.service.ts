import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/redis';

interface CreateInvitationDTO {
  templateId: string;
  title: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  venue?: string;
  venueAddress?: string;
  slug?: string;
}

interface UpdateInvitationDTO {
  title?: string;
  content?: Record<string, any>;
  settings?: Record<string, any>;
  groomName?: string;
  brideName?: string;
  eventDate?: string;
  venue?: string;
  venueAddress?: string;
  venueLat?: number;
  venueLng?: number;
}

export class InvitationsService {
  private async generateUniqueSlug(baseName: string): Promise<string> {
    const base = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = base;
    let counter = 0;

    while (true) {
      const existing = await prisma.invitation.findUnique({ where: { slug } });
      if (!existing) return slug;
      counter++;
      slug = `${base}-${counter}`;
    }
  }

  async createInvitation(userId: string, dto: CreateInvitationDTO) {
    const template = await prisma.template.findUnique({ where: { id: dto.templateId } });
    if (!template) throw Object.assign(new Error('Template not found'), { statusCode: 404 });

    const subscription = await prisma.subscription.findUnique({ where: { userId } });
    const planLimits: Record<string, number> = { FREE: 1, BASIC: 3, PREMIUM: 999, ENTERPRISE: 999 };
    const plan = subscription?.plan || 'FREE';
    const limit = planLimits[plan];

    const count = await prisma.invitation.count({ where: { userId } });
    if (count >= limit) {
      throw Object.assign(
        new Error(`Your ${plan} plan allows only ${limit} invitation(s). Please upgrade.`),
        { statusCode: 403 }
      );
    }

    if (template.isPremium && plan === 'FREE') {
      throw Object.assign(
        new Error('Premium templates require a paid plan'),
        { statusCode: 403 }
      );
    }

    const slug = dto.slug
      ? await this.generateUniqueSlug(dto.slug)
      : await this.generateUniqueSlug(`${dto.groomName}-and-${dto.brideName}`);

    const schema = template.schema as any;
    const defaultContent = {
      theme: schema.theme || {},
      sections: Object.entries(schema.sections || {}).map(([type, config]: [string, any], idx) => ({
        id: `${type}-${Date.now()}-${idx}`,
        type,
        enabled: config.enabled !== false,
        order: idx,
        content: {},
      })),
    };

    return prisma.invitation.create({
      data: {
        userId,
        templateId: dto.templateId,
        slug,
        title: dto.title,
        groomName: dto.groomName,
        brideName: dto.brideName,
        eventDate: new Date(dto.eventDate),
        venue: dto.venue,
        venueAddress: dto.venueAddress,
        content: defaultContent,
        settings: {},
      },
      include: { template: true },
    });
  }

  async getUserInvitations(userId: string) {
    return prisma.invitation.findMany({
      where: { userId },
      include: {
        template: { select: { name: true, slug: true, thumbnailUrl: true } },
        _count: { select: { rsvpResponses: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getInvitationById(id: string, userId: string) {
    const invitation = await prisma.invitation.findFirst({
      where: { id, userId },
      include: { template: true },
    });
    if (!invitation) throw Object.assign(new Error('Invitation not found'), { statusCode: 404 });
    return invitation;
  }

  async updateInvitation(id: string, userId: string, dto: UpdateInvitationDTO) {
    const invitation = await prisma.invitation.findFirst({ where: { id, userId } });
    if (!invitation) throw Object.assign(new Error('Invitation not found'), { statusCode: 404 });

    const updated = await prisma.invitation.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.content && { content: dto.content }),
        ...(dto.settings && { settings: dto.settings }),
        ...(dto.groomName && { groomName: dto.groomName }),
        ...(dto.brideName && { brideName: dto.brideName }),
        ...(dto.eventDate && { eventDate: new Date(dto.eventDate) }),
        ...(dto.venue !== undefined && { venue: dto.venue }),
        ...(dto.venueAddress !== undefined && { venueAddress: dto.venueAddress }),
        ...(dto.venueLat !== undefined && { venueLat: dto.venueLat }),
        ...(dto.venueLng !== undefined && { venueLng: dto.venueLng }),
      },
    });

    await redis.del(`invitation:${invitation.slug}`);
    return updated;
  }

  async publishInvitation(id: string, userId: string) {
    const invitation = await prisma.invitation.findFirst({ where: { id, userId } });
    if (!invitation) throw Object.assign(new Error('Invitation not found'), { statusCode: 404 });

    const updated = await prisma.invitation.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return {
      invitation: updated,
      publicUrl: `${appUrl}/inv/${updated.slug}`,
    };
  }

  async deleteInvitation(id: string, userId: string) {
    const invitation = await prisma.invitation.findFirst({ where: { id, userId } });
    if (!invitation) throw Object.assign(new Error('Invitation not found'), { statusCode: 404 });

    await prisma.invitation.delete({ where: { id } });
    await redis.del(`invitation:${invitation.slug}`);
    return { message: 'Invitation deleted' };
  }

  async getPublicInvitation(slug: string) {
    const cacheKey = `invitation:${slug}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      await prisma.invitation.update({
        where: { slug },
        data: { viewCount: { increment: 1 } },
      }).catch(() => {});
      return JSON.parse(cached);
    }

    const invitation = await prisma.invitation.findUnique({
      where: { slug, status: 'PUBLISHED' },
      include: {
        template: true,
        guestMessages: { where: { isApproved: true }, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!invitation) throw Object.assign(new Error('Invitation not found'), { statusCode: 404 });

    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { viewCount: { increment: 1 } },
    });

    await redis.setex(cacheKey, 60, JSON.stringify(invitation));
    return invitation;
  }
}
