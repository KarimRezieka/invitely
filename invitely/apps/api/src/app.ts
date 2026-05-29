import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import morgan from 'morgan';

import authRoutes from './modules/auth/auth.routes';
import templateRoutes from './modules/templates/templates.routes';
import invitationRoutes from './modules/invitations/invitations.routes';
import publicInvitationRoutes from './modules/invitations/public.routes';
import rsvpRoutes from './modules/rsvp/rsvp.routes';
import mediaRoutes from './modules/media/media.routes';
import paymentsRoutes from './modules/payments/payments.routes';
import adminRoutes from './modules/admin/admin.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.NEXT_PUBLIC_APP_URL,
  credentials: true,
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Stripe webhook needs raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(morgan('dev'));

app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/inv', publicInvitationRoutes);
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(errorHandler);

export default app;
