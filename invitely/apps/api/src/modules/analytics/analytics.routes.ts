import { Router } from 'express';
import { AnalyticsService } from './analytics.service';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const service = new AnalyticsService();

router.get('/:invitationId', authenticate, async (req, res, next) => {
  try {
    const period = (req.query.period as '7d' | '30d' | '90d') || '30d';
    const data = await service.getInvitationAnalytics(req.params.invitationId, (req as any).user.sub, period);
    res.json(data);
  } catch (err) { next(err); }
});

export default router;
