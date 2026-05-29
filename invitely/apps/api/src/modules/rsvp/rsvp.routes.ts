import { Router } from 'express';
import { RSVPService } from './rsvp.service';
import { authenticate } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();
const service = new RSVPService();

const submitSchema = z.object({
  guestName: z.string().min(1).max(100),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().optional(),
  status: z.enum(['ACCEPTED', 'DECLINED']),
  guestCount: z.number().int().min(1).max(10).optional(),
  plusOneName: z.string().optional(),
  mealPreference: z.string().optional(),
  notes: z.string().max(500).optional(),
});

router.post('/:slug', validateBody(submitSchema), async (req, res, next) => {
  try {
    const rsvp = await service.submitRSVP(req.params.slug, req.body, req.ip);
    res.status(201).json(rsvp);
  } catch (err) { next(err); }
});

router.get('/:invitationId/stats', authenticate, async (req, res, next) => {
  try {
    const stats = await service.getRSVPStats(req.params.invitationId);
    res.json(stats);
  } catch (err) { next(err); }
});

router.get('/:invitationId/export', authenticate, async (req, res, next) => {
  try {
    const csv = await service.exportRSVPsCSV(req.params.invitationId, (req as any).user.sub);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="rsvps-${req.params.invitationId}.csv"`);
    res.send(csv);
  } catch (err) { next(err); }
});

router.get('/:invitationId', authenticate, async (req, res, next) => {
  try {
    const rsvps = await service.getRSVPsByInvitation(
      req.params.invitationId,
      (req as any).user.sub,
      req.query as any
    );
    res.json(rsvps);
  } catch (err) { next(err); }
});

router.patch('/:id', authenticate, async (req, res, next) => {
  try {
    const rsvp = await service.updateRSVP(req.params.id, (req as any).user.sub, req.body);
    res.json(rsvp);
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const result = await service.deleteRSVP(req.params.id, (req as any).user.sub);
    res.json(result);
  } catch (err) { next(err); }
});

export default router;
