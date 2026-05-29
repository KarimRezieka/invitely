import { Router } from 'express';
import { InvitationsService } from './invitations.service';
import { AnalyticsService } from '../analytics/analytics.service';

const router = Router();
const service = new InvitationsService();
const analyticsService = new AnalyticsService();

router.get('/:slug', async (req, res, next) => {
  try {
    const invitation = await service.getPublicInvitation(req.params.slug);
    res.json(invitation);

    setImmediate(() => {
      analyticsService.trackView(invitation.id, req as any).catch(console.error);
    });
  } catch (err) {
    next(err);
  }
});

export default router;
