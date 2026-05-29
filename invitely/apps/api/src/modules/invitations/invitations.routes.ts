import { Router } from 'express';
import { InvitationsService } from './invitations.service';
import { authenticate } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();
const service = new InvitationsService();

const createSchema = z.object({
  templateId: z.string(),
  title: z.string().min(1).max(200),
  groomName: z.string().min(1).max(100),
  brideName: z.string().min(1).max(100),
  eventDate: z.string().datetime(),
  venue: z.string().optional(),
  venueAddress: z.string().optional(),
  slug: z.string().optional(),
});

const updateSchema = z.object({
  title: z.string().optional(),
  content: z.record(z.any()).optional(),
  settings: z.record(z.any()).optional(),
  groomName: z.string().optional(),
  brideName: z.string().optional(),
  eventDate: z.string().optional(),
  venue: z.string().optional(),
  venueAddress: z.string().optional(),
  venueLat: z.number().optional(),
  venueLng: z.number().optional(),
});

router.post('/', authenticate, validateBody(createSchema), async (req, res, next) => {
  try {
    const invitation = await service.createInvitation((req as any).user.sub, req.body);
    res.status(201).json(invitation);
  } catch (err) { next(err); }
});

router.get('/', authenticate, async (req, res, next) => {
  try {
    const invitations = await service.getUserInvitations((req as any).user.sub);
    res.json(invitations);
  } catch (err) { next(err); }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const invitation = await service.getInvitationById(req.params.id, (req as any).user.sub);
    res.json(invitation);
  } catch (err) { next(err); }
});

router.patch('/:id', authenticate, validateBody(updateSchema), async (req, res, next) => {
  try {
    const invitation = await service.updateInvitation(req.params.id, (req as any).user.sub, req.body);
    res.json(invitation);
  } catch (err) { next(err); }
});

router.post('/:id/publish', authenticate, async (req, res, next) => {
  try {
    const result = await service.publishInvitation(req.params.id, (req as any).user.sub);
    res.json(result);
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const result = await service.deleteInvitation(req.params.id, (req as any).user.sub);
    res.json(result);
  } catch (err) { next(err); }
});

export default router;
