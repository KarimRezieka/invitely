import { prisma } from '../../lib/prisma';
import { getIO } from '../../lib/socket';
import { sendRSVPConfirmationEmail } from '../../lib/mailer';

interface SubmitRSVPDTO {
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  status: 'ACCEPTED' | 'DECLINED';
  guestCount?: number;
  plusOneName?: string;
  mealPreference?: string;
  notes?: string;
}

export class RSVPService {
  async submitRSVP(invitationSlug: string, dto: SubmitRSVPDTO, ipAddress?: string) {
    const invitation = await prisma.invitation.findUnique({
      where: { slug: invitationSlug, status: 'PUBLISHED' },
    });
    if (!invitation) throw Object.assign(new Error('Invitation not found'), { statusCode: 404 });

    const rsvp = await prisma.rSVPResponse.create({
      data: {
        invitationId: invitation.id,
        guestName: dto.guestName,
        guestEmail: dto.guestEmail,
        guestPhone: dto.guestPhone,
        status: dto.status as any,
        guestCount: dto.guestCount || 1,
        plusOneName: dto.plusOneName,
        mealPreference: (dto.mealPreference as any) || 'STANDARD',
        notes: dto.notes,
        ipAddress,
      },
    });

    if (dto.guestEmail) {
      const coupleNames = `${invitation.groomName} & ${invitation.brideName}`;
      sendRSVPConfirmationEmail(
        dto.guestEmail,
        dto.guestName,
        coupleNames,
        invitation.eventDate,
        dto.status
      ).catch(console.error);
    }

    const stats = await this.getRSVPStats(invitation.id);
    const io = getIO();
    if (io) {
      io.to(`invitation:${invitation.id}`).emit('rsvp:new', { rsvp, stats });
    }

    return rsvp;
  }

  async getRSVPsByInvitation(invitationId: string, userId: string, filters?: { status?: string; search?: string }) {
    const invitation = await prisma.invitation.findFirst({ where: { id: invitationId, userId } });
    if (!invitation) throw Object.assign(new Error('Not found'), { statusCode: 404 });

    return prisma.rSVPResponse.findMany({
      where: {
        invitationId,
        ...(filters?.status && { status: filters.status as any }),
        ...(filters?.search && {
          OR: [
            { guestName: { contains: filters.search, mode: 'insensitive' } },
            { guestEmail: { contains: filters.search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateRSVP(rsvpId: string, userId: string, data: { isConfirmed?: boolean; notes?: string }) {
    const rsvp = await prisma.rSVPResponse.findUnique({
      where: { id: rsvpId },
      include: { invitation: true },
    });
    if (!rsvp || rsvp.invitation.userId !== userId) {
      throw Object.assign(new Error('Not found'), { statusCode: 404 });
    }
    return prisma.rSVPResponse.update({ where: { id: rsvpId }, data });
  }

  async deleteRSVP(rsvpId: string, userId: string) {
    const rsvp = await prisma.rSVPResponse.findUnique({
      where: { id: rsvpId },
      include: { invitation: true },
    });
    if (!rsvp || rsvp.invitation.userId !== userId) {
      throw Object.assign(new Error('Not found'), { statusCode: 404 });
    }
    await prisma.rSVPResponse.delete({ where: { id: rsvpId } });
    return { message: 'RSVP deleted' };
  }

  async getRSVPStats(invitationId: string) {
    const [total, accepted, declined, pending] = await Promise.all([
      prisma.rSVPResponse.count({ where: { invitationId } }),
      prisma.rSVPResponse.count({ where: { invitationId, status: 'ACCEPTED' } }),
      prisma.rSVPResponse.count({ where: { invitationId, status: 'DECLINED' } }),
      prisma.rSVPResponse.count({ where: { invitationId, status: 'PENDING' } }),
    ]);

    const guestCountResult = await prisma.rSVPResponse.aggregate({
      where: { invitationId, status: 'ACCEPTED' },
      _sum: { guestCount: true },
    });

    return {
      total,
      accepted,
      declined,
      pending,
      totalGuests: guestCountResult._sum.guestCount || 0,
    };
  }

  async exportRSVPsCSV(invitationId: string, userId: string): Promise<string> {
    const rsvps = await this.getRSVPsByInvitation(invitationId, userId);

    const headers = ['Name', 'Email', 'Phone', 'Status', 'Guests', 'Plus One', 'Meal', 'Notes', 'Date'];
    type RSVPRow = (typeof rsvps)[number];
    const rows = rsvps.map((r: RSVPRow) => [
      r.guestName,
      r.guestEmail || '',
      r.guestPhone || '',
      r.status,
      r.guestCount,
      r.plusOneName || '',
      r.mealPreference,
      r.notes || '',
      r.createdAt.toISOString(),
    ]);

    return [headers, ...rows].map((row) => row.map((v: unknown) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  }
}
