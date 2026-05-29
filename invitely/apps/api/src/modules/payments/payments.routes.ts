import { Router, Request, Response, NextFunction } from 'express';
import { PaymentsService } from './payments.service';
import { authenticate } from '../../middleware/auth.middleware';
import { stripe } from '../../lib/stripe';
import { z } from 'zod';
import { validateBody } from '../../middleware/validate.middleware';

const router = Router();
const service = new PaymentsService();

const checkoutSchema = z.object({
  plan: z.enum(['BASIC', 'PREMIUM']),
});

router.post('/checkout', authenticate, validateBody(checkoutSchema), async (req, res, next) => {
  try {
    const result = await service.createCheckoutSession((req as any).user.sub, req.body.plan);
    res.json(result);
  } catch (err) { next(err); }
});

router.post('/portal', authenticate, async (req, res, next) => {
  try {
    const result = await service.createBillingPortalSession((req as any).user.sub);
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/subscription', authenticate, async (req, res, next) => {
  try {
    const sub = await service.getSubscription((req as any).user.sub);
    res.json(sub);
  } catch (err) { next(err); }
});

router.post('/webhook', async (req: Request, res: Response, next: NextFunction) => {
  const sig = req.headers['stripe-signature'] as string;
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    await service.handleWebhook(event);
    res.json({ received: true });
  } catch (err: any) {
    res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }
});

export default router;
