import { prisma } from '../../lib/prisma';

function parseSource(referer?: string): string {
  if (!referer) return 'direct';
  if (referer.includes('whatsapp')) return 'whatsapp';
  if (referer.includes('instagram')) return 'instagram';
  if (referer.includes('facebook')) return 'facebook';
  if (referer.includes('twitter')) return 'twitter';
  return 'other';
}

function parseDevice(userAgent?: string): string {
  if (!userAgent) return 'unknown';
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

export { parseSource, parseDevice };

export class AnalyticsService {
  async trackView(invitationId: string, req: { headers: any; ip?: string }) {
    await prisma.invitationAnalytics.create({
      data: {
        invitationId,
        event: 'view',
        source: parseSource(req.headers.referer),
        device: parseDevice(req.headers['user-agent']),
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    }).catch(console.error);
  }

  async getInvitationAnalytics(invitationId: string, userId: string, period: '7d' | '30d' | '90d' = '30d') {
    const invitation = await prisma.invitation.findFirst({ where: { id: invitationId, userId } });
    if (!invitation) throw Object.assign(new Error('Not found'), { statusCode: 404 });

    const days = { '7d': 7, '30d': 30, '90d': 90 }[period];
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const events = await prisma.invitationAnalytics.findMany({
      where: { invitationId, createdAt: { gte: since } },
      orderBy: { createdAt: 'asc' },
    });

    type AnalyticsEvent = (typeof events)[number];

    const totalViews = events.filter((e: AnalyticsEvent) => e.event === 'view').length;

    const uniqueIPs = new Set(events.filter((e: AnalyticsEvent) => e.ipAddress).map((e: AnalyticsEvent) => e.ipAddress));
    const uniqueViews = uniqueIPs.size;

    const rsvpCount = await prisma.rSVPResponse.count({ where: { invitationId } });
    const rsvpConversionRate = totalViews > 0 ? ((rsvpCount / totalViews) * 100).toFixed(1) : '0';

    const viewsByDayMap: Record<string, number> = {};
    events.filter((e: AnalyticsEvent) => e.event === 'view').forEach((e: AnalyticsEvent) => {
      const date = e.createdAt.toISOString().split('T')[0];
      viewsByDayMap[date] = (viewsByDayMap[date] || 0) + 1;
    });

    const viewsByDay = Object.entries(viewsByDayMap).map(([date, views]) => ({ date, views }));

    const sourceCounts: Record<string, number> = {};
    events.forEach((e: AnalyticsEvent) => {
      if (e.source) sourceCounts[e.source] = (sourceCounts[e.source] || 0) + 1;
    });
    const topSources = Object.entries(sourceCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    const deviceCounts: Record<string, number> = {};
    events.forEach((e: AnalyticsEvent) => {
      if (e.device) deviceCounts[e.device] = (deviceCounts[e.device] || 0) + 1;
    });
    const deviceBreakdown = Object.entries(deviceCounts).map(([device, count]) => ({ device, count }));

    return {
      totalViews,
      uniqueViews,
      rsvpConversionRate: parseFloat(rsvpConversionRate as string),
      avgDailyViews: days > 0 ? (totalViews / days).toFixed(1) : '0',
      viewsByDay,
      topSources,
      deviceBreakdown,
    };
  }
}
