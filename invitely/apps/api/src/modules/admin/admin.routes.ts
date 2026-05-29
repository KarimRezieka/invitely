import { Router } from 'express';
import { AdminService } from './admin.service';
import { TemplatesService } from '../templates/templates.service';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/auth.middleware';

const router = Router();
const service = new AdminService();
const templatesService = new TemplatesService();

router.use(authenticate, requireRole('ADMIN', 'SUPER_ADMIN'));

router.get('/stats', async (req, res, next) => {
  try {
    const stats = await service.getPlatformStats();
    res.json(stats);
  } catch (err) { next(err); }
});

router.get('/users', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await service.getUsers(page, limit, req.query as any);
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/users/recent', async (req, res, next) => {
  try {
    const users = await service.getRecentUsers();
    res.json(users);
  } catch (err) { next(err); }
});

router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await service.getUserDetail(req.params.id);
    res.json(user);
  } catch (err) { next(err); }
});

router.patch('/users/:id', async (req, res, next) => {
  try {
    const user = await service.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) { next(err); }
});

router.get('/invitations', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await service.getAllInvitations(page, limit, req.query as any);
    res.json(result);
  } catch (err) { next(err); }
});

router.delete('/invitations/:id', async (req, res, next) => {
  try {
    const result = await service.deleteInvitation(req.params.id);
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/templates', async (req, res, next) => {
  try {
    const templates = await templatesService.getTemplates({});
    res.json(templates);
  } catch (err) { next(err); }
});

router.post('/templates', async (req, res, next) => {
  try {
    const template = await templatesService.createTemplate(req.body);
    res.status(201).json(template);
  } catch (err) { next(err); }
});

router.patch('/templates/:id', async (req, res, next) => {
  try {
    const template = await templatesService.updateTemplate(req.params.id, req.body);
    res.json(template);
  } catch (err) { next(err); }
});

router.patch('/templates/:id/toggle', async (req, res, next) => {
  try {
    const template = await templatesService.toggleTemplate(req.params.id);
    res.json(template);
  } catch (err) { next(err); }
});

export default router;
