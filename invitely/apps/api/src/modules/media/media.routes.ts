import { Router } from 'express';
import { MediaService } from './media.service';
import { authenticate } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload.middleware';

const router = Router();
const service = new MediaService();

router.post('/upload', authenticate, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });
    const asset = await service.upload(
      (req as any).user.sub,
      req.file,
      req.body.invitationId
    );
    res.status(201).json(asset);
  } catch (err) { next(err); }
});

router.get('/', authenticate, async (req, res, next) => {
  try {
    const assets = await service.getUserMedia((req as any).user.sub);
    res.json(assets);
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const result = await service.deleteMedia(req.params.id, (req as any).user.sub);
    res.json(result);
  } catch (err) { next(err); }
});

export default router;
