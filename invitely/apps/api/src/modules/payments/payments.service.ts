import { stripe } from '../../lib/stripe';
import { prisma } from '../../lib/prisma';
import Stripe from 'stripe';

const PLAN_PRICE_IDS: Record<string, string> = {
  BASIC: process.env.STRIPE_BASIC_PRICE_ID || '',
  PREMIUM: process.env.STRIPE_PREMIUM_PRICE_ID || '',
};

export class PaymentsService {
  async createCheckoutSession(userId: string, plan: 'BASIC' | 'PREMIUM') {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

    let sub = await prisma.subscription.findUnique({ where: { userId } });
    let customerId = sub?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId },
      });
      customerId = customer.id;
      await prisma.subscription.update({ where: { userId }, data: { stripeCustomerId: customerId } });
    }

    const priceId = PLAN_PRICE_IDS[plan];
    if (!priceId) throw new Error('Invalid plan or price not configured');

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/billing?success=true`,
      cancel_url: `${appUrl}/billing?canceled=true`,
      metadata: { userId, plan },
    });

    return { url: session.url };
  }

  async createBillingPortalSession(userId: string) {
    const sub = await prisma.subscription.findUnique({ where: { userId } });
    if (!sub?.stripeCustomerId) throw new Error('No billing account found');

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${appUrl}/billing`,
    });

    return { url: session.url };
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, plan } = session.metadata || {};
        if (userId && plan) {
          await prisma.subscription.update({
            where: { userId },
            data: {
              plan: plan as any,
              status: 'ACTIVE',
              stripeSubscriptionId: session.subscription as string,
            },
          });
        }
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = invoice.subscription as string;
        if (subId) {
          const stripeSub = await stripe.subscriptions.retrieve(subId);
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subId },
            data: {
              status: 'ACTIVE',
              currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
              currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
            },
          });
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = invoice.subscription as string;
        if (subId) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subId },
            data: { status: 'PAST_DUE' },
          });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const stripeSub = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: stripeSub.id },
          data: { status: 'CANCELED', plan: 'FREE' },
        });
        break;
      }
    }
  }

  async getSubscription(userId: string) {
    const sub = await prisma.subscription.findUnique({ where: { userId } });
    if (!sub) throw Object.assign(new Error('Subscription not found'), { statusCode: 404 });
    return sub;
  }
}
