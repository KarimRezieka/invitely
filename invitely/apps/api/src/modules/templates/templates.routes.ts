import { Router } from 'express';
import { TemplatesService } from './templates.service';

const router = Router();
const service = new TemplatesService();

router.get('/', async (req, res, next) => {
  try {
    const templates = await service.getTemplates(req.query as any);
    res.json(templates);
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const template = await service.getTemplateBySlug(req.params.slug);
    res.json(template);
  } catch (err) {
    next(err);
  }
});

export default router;
