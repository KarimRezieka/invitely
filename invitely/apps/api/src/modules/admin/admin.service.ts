import { prisma } from '../../lib/prisma';

export class AdminService {
  async getPlatformStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalUsers, newUsersThisMonth, verifiedUsers, totalInvitations, publishedInvitations, draftInvitations, totalRsvps, acceptedRsvps, planDist] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.user.count({ where: { emailVerified: true } }),
      prisma.invitation.count(),
      prisma.invitation.count({ where: { status: 'PUBLISHED' } }),
      prisma.invitation.count({ where: { status: 'DRAFT' } }),
      prisma.rSVPResponse.count(),
      prisma.rSVPResponse.count({ where: { status: 'ACCEPTED' } }),
      prisma.subscription.groupBy({ by: ['plan'], _count: true }),
    ]);

    const planCounts = planDist.reduce((acc: Record<string, number>, item: { plan: string; _count: number }) => {
      acc[item.plan.toLowerCase()] = item._count;
      return acc;
    }, {} as Record<string, number>);

    return {
      users: { total: totalUsers, newThisMonth: newUsersThisMonth, verified: verifiedUsers },
      invitations: { total: totalInvitations, published: publishedInvitations, drafts: draftInvitations },
      rsvps: { total: totalRsvps, accepted: acceptedRsvps },
      revenue: { mrr: 0, totalRevenue: 0 },
      plans: { free: planCounts.free || 0, basic: planCounts.basic || 0, premium: planCounts.premium || 0, enterprise: planCounts.enterprise || 0 },
    };
  }

  async getUsers(page = 1, limit = 10, filters?: { search?: string; plan?: string; role?: string }) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters?.role) where.role = filters.role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true, name: true, email: true, role: true, emailVerified: true, createdAt: true, avatarUrl: true,
          subscription: { select: { plan: true, status: true } },
          _count: { select: { invitations: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getUserDetail(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        subscription: true,
        invitations: { select: { id: true, title: true, status: true, createdAt: true } },
        _count: { select: { invitations: true, rsvpResponses: false } },
      },
    });
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
    const { passwordHash, emailVerifyToken, resetPasswordToken, ...safeUser } = user;
    return safeUser;
  }

  async updateUser(id: string, data: { role?: string; emailVerified?: boolean }) {
    return prisma.user.update({ where: { id }, data });
  }

  async getAllInvitations(page = 1, limit = 10, filters?: { status?: string; search?: string }) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { slug: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [invitations, total] = await Promise.all([
      prisma.invitation.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { name: true, email: true } },
          template: { select: { name: true } },
          _count: { select: { rsvpResponses: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.invitation.count({ where }),
    ]);

    return { invitations, total, page, totalPages: Math.ceil(total / limit) };
  }

  async deleteInvitation(id: string) {
    await prisma.invitation.delete({ where: { id } });
    return { message: 'Invitation deleted' };
  }

  async getRecentUsers(limit = 10) {
    return prisma.user.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, createdAt: true, subscription: { select: { plan: true } } },
    });
  }
}
