# 💍 Invitely — Premium Wedding Invitation SaaS Platform
## Complete Build Guide for Claude Code (Module-by-Module)

> **How to use this guide:** Give this entire file to Claude Code. It is structured **module by module** — each module must be **fully completed** (frontend + backend + DB + tests) before moving to the next. Do not skip ahead.

---

## 🗂️ Table of Contents

1. [Project Setup & Monorepo](#module-0-project-setup--monorepo)
2. [Database Schema](#module-1-database-schema)
3. [Authentication Module](#module-2-authentication-module)
4. [Template System Module](#module-3-template-system-module)
5. [Invitation Builder Module](#module-4-invitation-builder-module)
6. [RSVP System Module](#module-5-rsvp-system-module)
7. [Media Upload Module](#module-6-media-upload-module)
8. [Subscription & Payments Module](#module-7-subscription--payments-module)
9. [Admin Dashboard Module](#module-8-admin-dashboard-module)
10. [Analytics Module](#module-9-analytics-module)
11. [Deployment & DevOps](#module-10-deployment--devops)

---

## Tech Stack Reference

```
Frontend:   Next.js 14 (App Router) · TypeScript · TailwindCSS · Framer Motion · Shadcn UI · Zustand
Backend:    Node.js · Express · TypeScript · Prisma ORM · PostgreSQL · Redis · Socket.io
Auth:       JWT · bcrypt · Google OAuth · Nodemailer
Storage:    Cloudinary (media uploads)
Payments:   Stripe (subscriptions + one-time)
Infra:      Docker · Docker Compose · GitHub Actions CI/CD
```

---

## MODULE 0: Project Setup & Monorepo

> **Goal:** Scaffold the entire monorepo, install all dependencies, set up environment configs, and verify everything runs.

### 0.1 — Folder Structure to Create

```
invitely/
├── apps/
│   ├── web/                        # Next.js frontend
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── forgot-password/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── invitations/
│   │   │   │   ├── templates/
│   │   │   │   ├── settings/
│   │   │   │   └── billing/
│   │   │   ├── (admin)/
│   │   │   │   └── admin/
│   │   │   ├── inv/[slug]/         # Public invitation page
│   │   │   ├── builder/[id]/       # Invitation builder
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx            # Landing page
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/                 # Shadcn components
│   │   │   ├── auth/
│   │   │   ├── builder/
│   │   │   ├── invitation/
│   │   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   └── shared/
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── utils.ts
│   │   │   └── validations.ts
│   │   ├── store/
│   │   │   ├── auth.store.ts
│   │   │   ├── builder.store.ts
│   │   │   └── invitation.store.ts
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── public/
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   │
│   └── api/                        # Express backend
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── users/
│       │   │   ├── invitations/
│       │   │   ├── templates/
│       │   │   ├── rsvp/
│       │   │   ├── media/
│       │   │   ├── payments/
│       │   │   ├── admin/
│       │   │   └── analytics/
│       │   ├── middleware/
│       │   │   ├── auth.middleware.ts
│       │   │   ├── role.middleware.ts
│       │   │   ├── rateLimit.middleware.ts
│       │   │   ├── upload.middleware.ts
│       │   │   └── error.middleware.ts
│       │   ├── lib/
│       │   │   ├── prisma.ts
│       │   │   ├── redis.ts
│       │   │   ├── cloudinary.ts
│       │   │   ├── stripe.ts
│       │   │   ├── mailer.ts
│       │   │   └── socket.ts
│       │   ├── utils/
│       │   ├── types/
│       │   ├── app.ts
│       │   └── server.ts
│       ├── prisma/
│       │   └── schema.prisma
│       ├── Dockerfile
│       └── tsconfig.json
│
├── packages/
│   ├── ui/                         # Shared UI components (optional)
│   ├── types/                      # Shared TypeScript types
│   └── config/                     # Shared ESLint/TS configs
│
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── .gitignore
├── package.json                    # Root workspace
└── turbo.json                      # Turborepo config
```

### 0.2 — Root package.json

```json
{
  "name": "invitely",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "db:migrate": "cd apps/api && npx prisma migrate dev",
    "db:seed": "cd apps/api && npx prisma db seed",
    "db:studio": "cd apps/api && npx prisma studio"
  },
  "devDependencies": {
    "turbo": "^1.13.0"
  }
}
```

### 0.3 — turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {}
  }
}
```

### 0.4 — docker-compose.yml (Development)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: invitely
      POSTGRES_PASSWORD: invitely_secret
      POSTGRES_DB: invitely_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --requirepass redis_secret

volumes:
  postgres_data:
```

### 0.5 — .env.example

```env
# Database
DATABASE_URL="postgresql://invitely:invitely_secret@localhost:5432/invitely_db"

# Redis
REDIS_URL="redis://:redis_secret@localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-key-min-32-chars"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Frontend
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:4000"

# Backend
PORT=4000
NODE_ENV=development

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:4000/api/auth/google/callback"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Email (Resend or SMTP)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@invitely.com"
```

### 0.6 — Frontend Dependencies to Install

```bash
cd apps/web
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*"

# UI
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input label card dialog sheet tabs badge avatar dropdown-menu toast progress separator skeleton

# State & Forms
npm install zustand react-hook-form @hookform/resolvers zod

# Animations
npm install framer-motion

# HTTP
npm install axios

# Misc
npm install date-fns lucide-react react-colorful @hello-pangea/dnd
npm install -D @types/node
```

### 0.7 — Backend Dependencies to Install

```bash
cd apps/api
npm init -y
npm install express cors helmet express-rate-limit compression cookie-parser
npm install @prisma/client prisma
npm install jsonwebtoken bcryptjs passport passport-jwt passport-google-oauth20
npm install ioredis socket.io
npm install cloudinary multer
npm install stripe
npm install resend nodemailer
npm install zod express-validator
npm install winston morgan
npm install -D typescript ts-node nodemon @types/express @types/node @types/jsonwebtoken @types/bcryptjs @types/passport @types/multer @types/cors @types/cookie-parser @types/compression @types/morgan
```

### 0.8 — Verify Setup Checklist

- [ ] `docker-compose up -d` starts postgres + redis successfully
- [ ] `npm run dev` starts both web (port 3000) and api (port 4000)
- [ ] `/api/health` endpoint returns `{ status: "ok" }`
- [ ] Next.js landing page renders at `localhost:3000`
- [ ] Prisma can connect to DB: `npx prisma db push`

---

## MODULE 1: Database Schema

> **Goal:** Define the complete Prisma schema with all models, relations, and indexes. Run migrations. Seed initial data.

### 1.1 — Complete Prisma Schema

**File: `apps/api/prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── ENUMS ───────────────────────────────────────────────────────────────────

enum Role {
  USER
  ADMIN
  SUPER_ADMIN
}

enum AuthProvider {
  EMAIL
  GOOGLE
}

enum SubscriptionPlan {
  FREE
  BASIC
  PREMIUM
  ENTERPRISE
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  PAST_DUE
  TRIALING
  INCOMPLETE
}

enum InvitationStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum RSVPStatus {
  ACCEPTED
  DECLINED
  PENDING
}

enum MealPreference {
  STANDARD
  VEGETARIAN
  VEGAN
  HALAL
  KOSHER
  GLUTEN_FREE
}

enum TemplateCategory {
  LUXURY
  MINIMAL
  FLORAL
  ARABIC
  DARK
  MODERN
  RUSTIC
  BEACH
}

enum MediaType {
  IMAGE
  VIDEO
  AUDIO
}

// ─── USERS ───────────────────────────────────────────────────────────────────

model User {
  id                String    @id @default(cuid())
  email             String    @unique
  name              String
  avatarUrl         String?
  passwordHash      String?
  provider          AuthProvider @default(EMAIL)
  googleId          String?   @unique
  role              Role      @default(USER)
  emailVerified     Boolean   @default(false)
  emailVerifyToken  String?   @unique
  resetPasswordToken String?  @unique
  resetPasswordExpiry DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  // Relations
  subscription      Subscription?
  invitations       Invitation[]
  mediaAssets       MediaAsset[]
  payments          Payment[]
  sessions          Session[]

  @@map("users")
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  refreshToken String   @unique
  expiresAt    DateTime
  ipAddress    String?
  userAgent    String?
  createdAt    DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

// ─── SUBSCRIPTIONS ───────────────────────────────────────────────────────────

model Subscription {
  id                   String             @id @default(cuid())
  userId               String             @unique
  plan                 SubscriptionPlan   @default(FREE)
  status               SubscriptionStatus @default(ACTIVE)
  stripeCustomerId     String?            @unique
  stripeSubscriptionId String?            @unique
  stripePriceId        String?
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  cancelAtPeriodEnd    Boolean            @default(false)
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  payments Payment[]

  @@map("subscriptions")
}

model Payment {
  id                    String   @id @default(cuid())
  userId                String
  subscriptionId        String?
  stripePaymentIntentId String?  @unique
  amount                Int      // in cents
  currency              String   @default("usd")
  status                String
  description           String?
  createdAt             DateTime @default(now())

  user         User          @relation(fields: [userId], references: [id])
  subscription Subscription? @relation(fields: [subscriptionId], references: [id])

  @@map("payments")
}

// ─── TEMPLATES ───────────────────────────────────────────────────────────────

model Template {
  id           String           @id @default(cuid())
  name         String
  slug         String           @unique
  description  String?
  category     TemplateCategory
  thumbnailUrl String?
  previewUrl   String?
  isPremium    Boolean          @default(false)
  isActive     Boolean          @default(true)
  sortOrder    Int              @default(0)
  schema       Json             // JSON template schema (sections, defaults)
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt

  invitations Invitation[]

  @@map("templates")
}

// ─── INVITATIONS ─────────────────────────────────────────────────────────────

model Invitation {
  id          String           @id @default(cuid())
  userId      String
  templateId  String
  slug        String           @unique  // public URL slug e.g. "sara-and-ahmed"
  status      InvitationStatus @default(DRAFT)
  title       String
  groomName   String
  brideName   String
  eventDate   DateTime
  venue       String?
  venueAddress String?
  venueLat    Float?
  venueLng    Float?
  content     Json             // Full invitation content/customizations
  settings    Json?            // Music, animations, privacy settings
  viewCount   Int              @default(0)
  publishedAt DateTime?
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  user          User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  template      Template        @relation(fields: [templateId], references: [id])
  rsvpResponses RSVPResponse[]
  guestMessages GuestMessage[]
  mediaAssets   MediaAsset[]
  analytics     InvitationAnalytics[]

  @@map("invitations")
}

// ─── RSVP ─────────────────────────────────────────────────────────────────────

model RSVPResponse {
  id             String         @id @default(cuid())
  invitationId   String
  guestName      String
  guestEmail     String?
  guestPhone     String?
  status         RSVPStatus     @default(PENDING)
  guestCount     Int            @default(1)
  plusOneName    String?
  mealPreference MealPreference @default(STANDARD)
  notes          String?
  isConfirmed    Boolean        @default(false)
  ipAddress      String?
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  invitation Invitation @relation(fields: [invitationId], references: [id], onDelete: Cascade)

  @@map("rsvp_responses")
}

// ─── GUEST MESSAGES ───────────────────────────────────────────────────────────

model GuestMessage {
  id           String   @id @default(cuid())
  invitationId String
  authorName   String
  message      String
  avatarUrl    String?
  isApproved   Boolean  @default(true)
  createdAt    DateTime @default(now())

  invitation Invitation @relation(fields: [invitationId], references: [id], onDelete: Cascade)

  @@map("guest_messages")
}

// ─── MEDIA ASSETS ────────────────────────────────────────────────────────────

model MediaAsset {
  id           String    @id @default(cuid())
  userId       String
  invitationId String?
  type         MediaType
  url          String
  publicId     String    // Cloudinary public_id
  filename     String
  size         Int       // bytes
  mimeType     String
  width        Int?
  height       Int?
  duration     Float?    // seconds for video/audio
  createdAt    DateTime  @default(now())

  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  invitation Invitation? @relation(fields: [invitationId], references: [id])

  @@map("media_assets")
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────

model InvitationAnalytics {
  id           String   @id @default(cuid())
  invitationId String
  event        String   // "view", "rsvp_open", "rsvp_submit", "music_play", "share"
  source       String?  // "direct", "whatsapp", "instagram", etc.
  device       String?  // "mobile", "desktop", "tablet"
  country      String?
  city         String?
  ipAddress    String?
  userAgent    String?
  createdAt    DateTime @default(now())

  invitation Invitation @relation(fields: [invitationId], references: [id], onDelete: Cascade)

  @@index([invitationId, createdAt])
  @@map("invitation_analytics")
}

// ─── SUPPORT ─────────────────────────────────────────────────────────────────

model SupportTicket {
  id        String   @id @default(cuid())
  email     String
  subject   String
  message   String
  status    String   @default("open") // open, in_progress, resolved
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("support_tickets")
}
```

### 1.2 — Seed File

**File: `apps/api/prisma/seed.ts`**

```typescript
import { PrismaClient, TemplateCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@invitely.com' },
    update: {},
    create: {
      email: 'admin@invitely.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: 'ADMIN',
      emailVerified: true,
      subscription: {
        create: { plan: 'ENTERPRISE', status: 'ACTIVE' }
      }
    }
  });

  // Create demo templates
  const templates = [
    {
      name: 'Golden Luxury',
      slug: 'golden-luxury',
      description: 'An opulent gold and ivory design with elegant serif typography',
      category: TemplateCategory.LUXURY,
      isPremium: true,
      thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/golden-luxury-thumb.jpg',
      schema: {
        theme: { primary: '#C9A84C', secondary: '#F5F0E8', font: 'Playfair Display' },
        sections: {
          hero: { enabled: true, layout: 'centered', backgroundType: 'image' },
          countdown: { enabled: true },
          story: { enabled: true },
          eventDetails: { enabled: true },
          gallery: { enabled: true },
          rsvp: { enabled: true },
          guestbook: { enabled: true },
        }
      }
    },
    {
      name: 'Minimal White',
      slug: 'minimal-white',
      description: 'Clean, modern minimalism with generous whitespace',
      category: TemplateCategory.MINIMAL,
      isPremium: false,
      schema: {
        theme: { primary: '#1A1A1A', secondary: '#FFFFFF', font: 'Inter' },
        sections: {
          hero: { enabled: true, layout: 'split' },
          eventDetails: { enabled: true },
          rsvp: { enabled: true },
        }
      }
    },
    {
      name: 'Rose Garden',
      slug: 'rose-garden',
      description: 'Romantic floral design with watercolor roses',
      category: TemplateCategory.FLORAL,
      isPremium: false,
      schema: {
        theme: { primary: '#C2607A', secondary: '#FDF6F0', font: 'Cormorant Garamond' },
        sections: {
          hero: { enabled: true },
          countdown: { enabled: true },
          gallery: { enabled: true },
          rsvp: { enabled: true },
          guestbook: { enabled: true },
        }
      }
    },
    {
      name: 'Arabian Nights',
      slug: 'arabian-nights',
      description: 'Rich Arabic-inspired patterns with RTL support',
      category: TemplateCategory.ARABIC,
      isPremium: true,
      schema: {
        theme: { primary: '#8B2E2E', secondary: '#FFF8E7', font: 'Amiri', rtl: true },
        sections: {
          hero: { enabled: true },
          countdown: { enabled: true },
          eventDetails: { enabled: true },
          rsvp: { enabled: true },
        }
      }
    },
    {
      name: 'Midnight Glamour',
      slug: 'midnight-glamour',
      description: 'Dark, moody luxury with gold accents',
      category: TemplateCategory.DARK,
      isPremium: true,
      schema: {
        theme: { primary: '#D4AF37', secondary: '#0A0A0A', font: 'Cinzel', dark: true },
        sections: {
          hero: { enabled: true },
          countdown: { enabled: true },
          gallery: { enabled: true },
          rsvp: { enabled: true },
          guestbook: { enabled: true },
        }
      }
    },
    {
      name: 'Modern Script',
      slug: 'modern-script',
      description: 'Contemporary design with flowing script accents',
      category: TemplateCategory.MODERN,
      isPremium: false,
      schema: {
        theme: { primary: '#2D6A4F', secondary: '#F8F9FA', font: 'DM Serif Display' },
        sections: {
          hero: { enabled: true },
          story: { enabled: true },
          eventDetails: { enabled: true },
          rsvp: { enabled: true },
        }
      }
    },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { slug: template.slug },
      update: template,
      create: template,
    });
  }

  console.log('✅ Database seeded successfully');
}

main().catch(console.error).finally(() => prisma.$disconnect());
```

Add to `apps/api/package.json`:
```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

### 1.3 — Migration Commands

```bash
cd apps/api
npx prisma migrate dev --name init
npx prisma db seed
npx prisma studio   # verify data
```

### 1.4 — Module 1 Checklist

- [ ] All models created in schema.prisma
- [ ] `prisma migrate dev` runs without errors
- [ ] `prisma db seed` inserts admin user + 6 templates
- [ ] Prisma Studio shows all tables correctly
- [ ] All relations and indexes are valid

---

## MODULE 2: Authentication Module

> **Goal:** Complete auth system — registration, login, email verification, forgot password, Google OAuth, refresh tokens, protected routes. Both frontend and backend must be fully working before moving on.

### 2.1 — Backend: Auth Module

#### File: `apps/api/src/lib/prisma.ts`
```typescript
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
```

#### File: `apps/api/src/lib/redis.ts`
```typescript
import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

redis.on('error', (err) => console.error('Redis error:', err));
redis.on('connect', () => console.log('✅ Redis connected'));
```

#### File: `apps/api/src/lib/mailer.ts`
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: 'Verify your Invitely account',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="color:#C9A84C;">Welcome to Invitely, ${name}!</h1>
        <p>Please verify your email address to get started.</p>
        <a href="${url}" style="display:inline-block;background:#C9A84C;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">Verify Email</a>
        <p style="color:#999;font-size:12px;">Link expires in 24 hours.</p>
      </div>
    `
  });
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: 'Reset your Invitely password',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="color:#C9A84C;">Password Reset</h1>
        <p>Hi ${name}, we received a request to reset your password.</p>
        <a href="${url}" style="display:inline-block;background:#C9A84C;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">Reset Password</a>
        <p style="color:#999;font-size:12px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `
  });
}
```

#### File: `apps/api/src/modules/auth/auth.types.ts`
```typescript
export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
```

#### File: `apps/api/src/modules/auth/auth.service.ts`
```typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/redis';
import { sendVerificationEmail, sendPasswordResetEmail } from '../../lib/mailer';
import { RegisterDTO, LoginDTO, TokenPayload } from './auth.types';

export class AuthService {
  private generateTokens(payload: TokenPayload) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });
    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDTO) {
    const existing = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new Error('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const emailVerifyToken = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        emailVerifyToken,
        subscription: { create: { plan: 'FREE', status: 'ACTIVE' } }
      }
    });

    await sendVerificationEmail(user.email, user.name, emailVerifyToken);
    return { message: 'Registration successful. Please check your email to verify your account.' };
  }

  async login(dto: LoginDTO, ipAddress?: string, userAgent?: string) {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash) throw new Error('Invalid credentials');
    if (!user.emailVerified) throw new Error('Please verify your email before logging in');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');

    const payload: TokenPayload = { sub: user.id, email: user.email, role: user.role };
    const { accessToken, refreshToken } = this.generateTokens(payload);

    // Store refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.session.create({
      data: { userId: user.id, refreshToken, expiresAt, ipAddress, userAgent }
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl }
    };
  }

  async verifyEmail(token: string) {
    const user = await prisma.user.findUnique({ where: { emailVerifyToken: token } });
    if (!user) throw new Error('Invalid or expired verification token');

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailVerifyToken: null }
    });

    return { message: 'Email verified successfully' };
  }

  async refreshTokens(refreshToken: string) {
    const session = await prisma.session.findUnique({ where: { refreshToken } });
    if (!session || session.expiresAt < new Date()) throw new Error('Invalid refresh token');

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
    const newPayload: TokenPayload = { sub: payload.sub, email: payload.email, role: payload.role };
    const tokens = this.generateTokens(newPayload);

    // Rotate refresh token
    await prisma.session.update({
      where: { id: session.id },
      data: { refreshToken: tokens.refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    });

    return tokens;
  }

  async logout(refreshToken: string) {
    await prisma.session.deleteMany({ where: { refreshToken } });
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { message: 'If that email is registered, a reset link has been sent.' };

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: token, resetPasswordExpiry: expiry }
    });

    await sendPasswordResetEmail(user.email, user.name, token);
    return { message: 'If that email is registered, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiry: { gt: new Date() }
      }
    });
    if (!user) throw new Error('Invalid or expired reset token');

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetPasswordToken: null, resetPasswordExpiry: null }
    });

    // Invalidate all sessions
    await prisma.session.deleteMany({ where: { userId: user.id } });
    return { message: 'Password reset successfully. Please log in.' };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    });
    if (!user) throw new Error('User not found');
    const { passwordHash, emailVerifyToken, resetPasswordToken, ...safeUser } = user;
    return safeUser;
  }
}
```

#### File: `apps/api/src/modules/auth/auth.controller.ts`
```typescript
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(
      req.body,
      req.ip,
      req.headers['user-agent']
    );

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: result.accessToken, user: result.user });
  } catch (err: any) {
    next(err);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.verifyEmail(req.query.token as string);
    res.json(result);
  } catch (err: any) {
    next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

    const tokens = await authService.refreshTokens(refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: tokens.accessToken });
  } catch (err: any) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) await authService.logout(refreshToken);
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
  } catch (err: any) {
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    res.json(result);
  } catch (err: any) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.resetPassword(req.body.token, req.body.password);
    res.json(result);
  } catch (err: any) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe((req as any).user.sub);
    res.json(user);
  } catch (err: any) {
    next(err);
  }
};
```

#### File: `apps/api/src/modules/auth/auth.routes.ts`
```typescript
import { Router } from 'express';
import * as authController from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[A-Z])(?=.*[0-9])/, 'Password must contain uppercase and number'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.get('/verify-email', authController.verifyEmail);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', authenticate, authController.getMe);

// Google OAuth
router.get('/google', /* passport.authenticate('google') */);
router.get('/google/callback', /* passport.authenticate callback */);

export default router;
```

#### File: `apps/api/src/middleware/auth.middleware.ts`
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../modules/auth/auth.types';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
```

#### File: `apps/api/src/middleware/validate.middleware.ts`
```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: 'Validation error',
        errors: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data;
    next();
  };
};
```

#### File: `apps/api/src/middleware/error.middleware.ts`
```typescript
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ message });
};
```

#### File: `apps/api/src/app.ts`
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import authRoutes from './modules/auth/auth.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.NEXT_PUBLIC_APP_URL,
  credentials: true,
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Routes
app.use('/api/auth', authRoutes);

// Error handler
app.use(errorHandler);

export default app;
```

#### File: `apps/api/src/server.ts`
```typescript
import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
});
```

---

### 2.2 — Frontend: Auth Module

#### File: `apps/web/lib/api.ts`
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
  withCredentials: true,
});

// Request interceptor — attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await api.post('/auth/refresh');
        localStorage.setItem('accessToken', data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### File: `apps/web/store/auth.store.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  subscription?: { plan: string; status: string };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) => {
        localStorage.setItem('accessToken', accessToken);
        set({ user, accessToken, isAuthenticated: true });
      },
      clearAuth: () => {
        localStorage.removeItem('accessToken');
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
      updateUser: (updates) =>
        set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
```

#### File: `apps/web/app/(auth)/login/page.tsx`
```tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      setAuth(res.data.user, res.data.accessToken);
      toast({ title: 'Welcome back!', description: `Good to see you, ${res.data.user.name}` });
      router.push('/dashboard');
    } catch (err: any) {
      toast({
        title: 'Login failed',
        description: err.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Decorative */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-900 via-amber-700 to-amber-500 relative overflow-hidden items-center justify-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[url('/patterns/floral.svg')] opacity-10" />
        <div className="text-center text-white z-10 px-12">
          <h1 className="text-5xl font-serif mb-4">Invitely</h1>
          <p className="text-xl opacity-80">Craft your perfect love story, one invite at a time.</p>
        </div>
      </motion.div>

      {/* Right — Form */}
      <motion.div
        className="flex-1 flex items-center justify-center px-8 py-12 bg-white dark:bg-zinc-950"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-zinc-500 mt-2">Sign in to continue to Invitely</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-amber-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={loading}>
              {loading ? <><Loader2 size={16} className="animate-spin mr-2" /> Signing in...</> : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-zinc-500 text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-amber-600 hover:underline font-medium">Sign up free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
```

#### File: `apps/web/app/(auth)/register/page.tsx`

> Create a matching register page with fields: name, email, password, confirm password. On success, show a "Check your email" confirmation screen. Same split layout as login.

#### File: `apps/web/app/(auth)/forgot-password/page.tsx`

> Single email field form. On submit call `POST /api/auth/forgot-password`. Show success message.

#### File: `apps/web/components/shared/ProtectedRoute.tsx`
```tsx
'use client';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;
  return <>{children}</>;
}
```

#### File: `apps/web/app/(dashboard)/layout.tsx`
```tsx
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        <DashboardNav />
        <main className="flex-1 overflow-auto bg-zinc-50 dark:bg-zinc-900">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
```

### 2.3 — Module 2 Checklist

- [ ] `POST /api/auth/register` creates user, sends verification email
- [ ] `GET /api/auth/verify-email?token=xxx` verifies email
- [ ] `POST /api/auth/login` returns access token + sets httpOnly refresh cookie
- [ ] `POST /api/auth/refresh` rotates tokens correctly
- [ ] `POST /api/auth/logout` clears session
- [ ] `POST /api/auth/forgot-password` sends reset email
- [ ] `POST /api/auth/reset-password` updates password, invalidates all sessions
- [ ] `GET /api/auth/me` returns user profile (requires valid access token)
- [ ] Login page renders and submits correctly
- [ ] Register page creates account
- [ ] Forgot password flow works end-to-end
- [ ] Protected dashboard routes redirect unauthenticated users to `/login`
- [ ] Auth state persists on page refresh (Zustand persist)

---

## MODULE 3: Template System Module

> **Goal:** Template marketplace — browse, filter by category, preview, favorite. Templates are fetched from DB.

### 3.1 — Backend: Template Routes

#### File: `apps/api/src/modules/templates/templates.service.ts`
```typescript
import { prisma } from '../../lib/prisma';

export class TemplatesService {
  async getTemplates(filters: { category?: string; isPremium?: boolean; search?: string }) {
    return prisma.template.findMany({
      where: {
        isActive: true,
        ...(filters.category && { category: filters.category as any }),
        ...(filters.isPremium !== undefined && { isPremium: filters.isPremium }),
        ...(filters.search && {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
          ]
        }),
      },
      orderBy: [{ isPremium: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  async getTemplateBySlug(slug: string) {
    const template = await prisma.template.findUnique({ where: { slug } });
    if (!template) throw Object.assign(new Error('Template not found'), { statusCode: 404 });
    return template;
  }
}
```

#### File: `apps/api/src/modules/templates/templates.routes.ts`
```typescript
import { Router } from 'express';
import { TemplatesService } from './templates.service';

const router = Router();
const service = new TemplatesService();

router.get('/', async (req, res, next) => {
  try {
    const templates = await service.getTemplates(req.query as any);
    res.json(templates);
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const template = await service.getTemplateBySlug(req.params.slug);
    res.json(template);
  } catch (err) { next(err); }
});

export default router;
```

Register in `app.ts`: `app.use('/api/templates', templateRoutes);`

### 3.2 — Frontend: Template Marketplace

#### File: `apps/web/app/(dashboard)/templates/page.tsx`

Build a full page with:
- Header: "Choose Your Template" with subtitle
- Search input (debounced 300ms)
- Category filter tabs: All / Luxury / Minimal / Floral / Arabic / Dark / Modern
- Free/Premium filter toggle
- Template grid (responsive: 1col mobile, 2col tablet, 3col desktop)
- Each template card must include:
  - Thumbnail image with overlay on hover
  - Template name + category badge
  - "Premium" badge if isPremium
  - "Preview" button (opens modal)
  - "Use This Template" button (navigates to builder)
- Loading state: skeleton cards (6 cards)
- Empty state: "No templates found" illustration

#### File: `apps/web/components/invitation/TemplateCard.tsx`

```tsx
'use client';
import { motion } from 'framer-motion';
import { Crown, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Props {
  template: {
    id: string;
    name: string;
    slug: string;
    category: string;
    thumbnailUrl?: string;
    isPremium: boolean;
  };
  onPreview: () => void;
  onSelect: () => void;
}

export default function TemplateCard({ template, onPreview, onSelect }: Props) {
  return (
    <motion.div
      className="group relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg transition-all duration-300"
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
        {template.thumbnailUrl ? (
          <img src={template.thumbnailUrl} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-300">
            <span className="text-5xl">💍</span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Button size="sm" variant="outline" className="text-white border-white hover:bg-white hover:text-black" onClick={onPreview}>
            <Eye size={14} className="mr-1" /> Preview
          </Button>
          <Button size="sm" className="bg-amber-500 hover:bg-amber-600" onClick={onSelect}>
            Use This
          </Button>
        </div>

        {template.isPremium && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-amber-500 text-white gap-1"><Crown size={10} /> Premium</Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate">{template.name}</h3>
        <Badge variant="outline" className="text-xs mt-1 capitalize">{template.category.toLowerCase()}</Badge>
      </div>
    </motion.div>
  );
}
```

### 3.3 — Module 3 Checklist

- [ ] `GET /api/templates` returns all active templates with filters (category, search)
- [ ] `GET /api/templates/:slug` returns single template with full schema
- [ ] Template marketplace page loads and displays all 6 seeded templates
- [ ] Category filter tabs work
- [ ] Search filters templates by name/description
- [ ] Template cards show premium badge for premium templates
- [ ] Hover overlay shows Preview + Use This buttons
- [ ] Loading skeleton shown while fetching
- [ ] Selecting a template navigates to `/builder/new?template=SLUG`

---

## MODULE 4: Invitation Builder Module

> **Goal:** The core product — a rich visual invitation builder. Users can customize their invitation content section by section, see live preview, and publish.

### 4.1 — Backend: Invitations CRUD

#### File: `apps/api/src/modules/invitations/invitations.service.ts`

Implement full CRUD:

```typescript
// Methods to implement:
// createInvitation(userId, dto) — create invitation from template
// getUserInvitations(userId) — list user's invitations
// getInvitationById(id, userId) — get single invitation (auth check)
// updateInvitation(id, userId, dto) — update content/settings
// publishInvitation(id, userId) — set status to PUBLISHED
// deleteInvitation(id, userId) — soft delete or hard delete
// getPublicInvitation(slug) — fetch published invitation by slug (no auth, increments viewCount)
// generateUniqueSlug(baseName) — generate URL-safe unique slug
```

#### Key DTOs

```typescript
interface CreateInvitationDTO {
  templateId: string;
  title: string;
  groomName: string;
  brideName: string;
  eventDate: string; // ISO string
  venue?: string;
  venueAddress?: string;
  slug?: string; // optional, auto-generated if empty
}

interface UpdateInvitationDTO {
  title?: string;
  content?: Record<string, any>;
  settings?: Record<string, any>;
  groomName?: string;
  brideName?: string;
  eventDate?: string;
  venue?: string;
  venueAddress?: string;
  venueLat?: number;
  venueLng?: number;
}
```

#### File: `apps/api/src/modules/invitations/invitations.routes.ts`
```
POST   /api/invitations              — create (auth required)
GET    /api/invitations              — list user's invitations (auth)
GET    /api/invitations/:id          — get by ID (auth, owner only)
PATCH  /api/invitations/:id          — update (auth, owner only)
POST   /api/invitations/:id/publish  — publish (auth, owner only)
DELETE /api/invitations/:id          — delete (auth, owner only)
GET    /api/inv/:slug               — public invitation page (no auth)
```

### 4.2 — Frontend: Builder Store

#### File: `apps/web/store/builder.store.ts`
```typescript
import { create } from 'zustand';
import { temporal } from 'zundo'; // for undo/redo

interface Section {
  id: string;
  type: string;
  enabled: boolean;
  order: number;
  content: Record<string, any>;
}

interface BuilderState {
  invitationId: string | null;
  templateSchema: any | null;
  sections: Section[];
  activeSection: string | null;
  theme: {
    primary: string;
    secondary: string;
    font: string;
  };
  settings: {
    musicUrl?: string;
    musicAutoplay: boolean;
    passwordProtected: boolean;
    password?: string;
  };
  isSaving: boolean;
  lastSaved: Date | null;
  isDirty: boolean;
  previewMode: 'desktop' | 'mobile';

  // Actions
  setInvitation: (id: string, data: any) => void;
  updateSection: (sectionId: string, content: Partial<Record<string, any>>) => void;
  toggleSection: (sectionId: string) => void;
  reorderSections: (sections: Section[]) => void;
  setActiveSection: (sectionId: string | null) => void;
  updateTheme: (theme: Partial<BuilderState['theme']>) => void;
  updateSettings: (settings: Partial<BuilderState['settings']>) => void;
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  setSaving: (status: boolean) => void;
  markSaved: () => void;
}

export const useBuilderStore = create<BuilderState>()(
  temporal(
    (set) => ({
      invitationId: null,
      templateSchema: null,
      sections: [],
      activeSection: null,
      theme: { primary: '#C9A84C', secondary: '#F5F0E8', font: 'Playfair Display' },
      settings: { musicAutoplay: false, passwordProtected: false },
      isSaving: false,
      lastSaved: null,
      isDirty: false,
      previewMode: 'desktop',

      setInvitation: (id, data) => set({
        invitationId: id,
        templateSchema: data.template?.schema,
        sections: data.sections || [],
        theme: data.content?.theme || { primary: '#C9A84C', secondary: '#F5F0E8', font: 'Playfair Display' },
        settings: data.settings || {},
        isDirty: false,
      }),

      updateSection: (sectionId, content) => set((state) => ({
        sections: state.sections.map((s) =>
          s.id === sectionId ? { ...s, content: { ...s.content, ...content } } : s
        ),
        isDirty: true,
      })),

      toggleSection: (sectionId) => set((state) => ({
        sections: state.sections.map((s) =>
          s.id === sectionId ? { ...s, enabled: !s.enabled } : s
        ),
        isDirty: true,
      })),

      reorderSections: (sections) => set({ sections, isDirty: true }),
      setActiveSection: (sectionId) => set({ activeSection: sectionId }),
      updateTheme: (theme) => set((state) => ({ theme: { ...state.theme, ...theme }, isDirty: true })),
      updateSettings: (settings) => set((state) => ({ settings: { ...state.settings, ...settings }, isDirty: true })),
      setPreviewMode: (mode) => set({ previewMode: mode }),
      setSaving: (status) => set({ isSaving: status }),
      markSaved: () => set({ isSaving: false, lastSaved: new Date(), isDirty: false }),
    })
  )
);
```

### 4.3 — Frontend: Builder Page

#### File: `apps/web/app/builder/[id]/page.tsx`

Build the builder with this layout:
```
┌─────────────────────────────────────────────────────┐
│  Top Bar: Logo | Invitation Title | Preview | Save  │
├──────────┬──────────────────────────┬────────────────┤
│  Sidebar │      Live Preview        │  Panel         │
│  (left)  │   (phone or desktop)     │  (right)       │
│          │                          │                │
│ Section  │  Renders actual invite   │  Active        │
│ list     │  in real-time            │  section       │
│          │                          │  editor        │
│ Drag &   │                          │  fields        │
│ drop     │                          │                │
│ reorder  │                          │                │
└──────────┴──────────────────────────┴────────────────┘
```

**Left Sidebar** (`BuilderSidebar.tsx`):
- List of sections (hero, countdown, gallery, etc.)
- Toggle ON/OFF switch per section
- Drag handle for reordering (use `@hello-pangea/dnd`)
- Click section to open its editor in right panel

**Center Preview** (`BuilderPreview.tsx`):
- Renders the invitation in an iframe-like container
- Desktop/Mobile toggle at the top
- Scrollable preview
- Real-time updates as user edits

**Right Panel** (`BuilderPanel.tsx`):
- Changes based on active section
- Each section type has its own editor component:
  - `HeroEditor.tsx` — couple names, date, background image upload
  - `CountdownEditor.tsx` — event date/time
  - `GalleryEditor.tsx` — image upload grid (up to 12 photos)
  - `RSVPEditor.tsx` — form fields toggle, meal preferences toggle
  - `ThemeEditor.tsx` — color pickers, font selector
  - `MusicEditor.tsx` — upload audio file, autoplay toggle

**Autosave**: Debounced autosave every 3 seconds when `isDirty === true`. Call `PATCH /api/invitations/:id`.

**Top Bar**: Publish button → calls `POST /api/invitations/:id/publish` → shows shareable link modal.

### 4.4 — Frontend: Public Invitation Page

#### File: `apps/web/app/inv/[slug]/page.tsx`

Render a beautiful full-page invitation using the stored content:
- Load `GET /api/inv/:slug`
- Render each enabled section in order
- Use Framer Motion for scroll-reveal animations on each section
- Support: hero, countdown timer (live), event details, gallery, RSVP form, guestbook

### 4.5 — Module 4 Checklist

- [ ] `POST /api/invitations` creates invitation from template, auto-generates slug
- [ ] `GET /api/invitations` lists user's invitations in dashboard
- [ ] `PATCH /api/invitations/:id` saves builder content
- [ ] `POST /api/invitations/:id/publish` publishes and returns public URL
- [ ] `GET /api/inv/:slug` returns public invitation (no auth), increments viewCount
- [ ] Builder page loads with correct template schema
- [ ] Left sidebar shows all sections with toggle + drag-reorder
- [ ] Right panel shows correct editor for active section
- [ ] Live preview updates in real-time as user edits
- [ ] Desktop/mobile preview toggle works
- [ ] Autosave triggers 3s after last change, shows "Saving..." → "Saved"
- [ ] Undo/redo works (Ctrl+Z / Ctrl+Y)
- [ ] Publish button shows shareable link modal with copy button
- [ ] Public invitation page renders beautifully with animations

---

## MODULE 5: RSVP System Module

> **Goal:** Full RSVP flow — guests submit responses, couple views in dashboard, export CSV, real-time updates via WebSocket.

### 5.1 — Backend: RSVP Module

#### File: `apps/api/src/modules/rsvp/rsvp.service.ts`

```typescript
// Methods:
// submitRSVP(invitationSlug, dto) — public, no auth required
// getRSVPsByInvitation(invitationId, userId) — owner only
// updateRSVP(rsvpId, userId, dto) — owner can update status/notes
// deleteRSVP(rsvpId, userId) — owner can delete
// getRSVPStats(invitationId) — { total, accepted, declined, pending, totalGuests }
// exportRSVPsCSV(invitationId, userId) — returns CSV string
```

#### RSVP Submit DTO
```typescript
interface SubmitRSVPDTO {
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  status: 'ACCEPTED' | 'DECLINED';
  guestCount?: number;    // 1-10
  plusOneName?: string;
  mealPreference?: string;
  notes?: string;
}
```

#### Routes
```
POST /api/rsvp/:slug          — submit RSVP (public)
GET  /api/rsvp/:invitationId  — list RSVPs (auth, owner)
PATCH /api/rsvp/:id           — update RSVP status (auth, owner)
DELETE /api/rsvp/:id          — delete RSVP (auth, owner)
GET  /api/rsvp/:invitationId/stats   — stats (auth, owner)
GET  /api/rsvp/:invitationId/export  — CSV export (auth, owner)
```

#### WebSocket Events (Socket.io)

When a new RSVP is submitted, emit to the invitation owner's room:
```typescript
io.to(`invitation:${invitationId}`).emit('rsvp:new', { rsvp, stats });
```

Owner's dashboard joins room on connect:
```typescript
socket.join(`invitation:${invitationId}`);
```

### 5.2 — Frontend: RSVP Form (Public Page)

#### File: `apps/web/components/invitation/sections/RSVPSection.tsx`

Multi-step RSVP form:
1. **Step 1:** Name + Email + Phone
2. **Step 2:** Accept/Decline (large animated buttons)
3. **Step 3 (if accepted):** Guest count, plus one name, meal preference
4. **Step 4:** Personal message/note
5. **Confirmation:** Beautiful animated thank-you screen

Animations:
- Slide between steps with Framer Motion
- Confetti animation on acceptance
- Smooth success/error states

### 5.3 — Frontend: RSVP Dashboard

#### File: `apps/web/app/(dashboard)/invitations/[id]/rsvp/page.tsx`

Build a full RSVP management dashboard:
- **Stats row**: Total RSVPs | Attending | Declined | Pending | Total Guests
- **Filter tabs**: All | Attending | Declined | Pending
- **Search**: by guest name or email
- **RSVP table**: Name | Status | Guests | Meal | Date | Actions
- **Real-time badge**: "Live" indicator when connected via WebSocket
- **Export CSV** button
- **Delete confirmation dialog**

### 5.4 — Module 5 Checklist

- [ ] `POST /api/rsvp/:slug` saves RSVP, sends confirmation email to guest
- [ ] RSVP form on public invitation page works end-to-end
- [ ] Multi-step RSVP flow with animations
- [ ] Thank-you confirmation screen shows after submission
- [ ] RSVP dashboard shows all responses with stats
- [ ] Real-time WebSocket update when new RSVP arrives (without page refresh)
- [ ] CSV export downloads a properly formatted file
- [ ] Owner can mark RSVPs as confirmed / delete them

---

## MODULE 6: Media Upload Module

> **Goal:** Image, video, audio uploads via Cloudinary. Used in builder for backgrounds, gallery, music.

### 6.1 — Backend: Media Module

#### File: `apps/api/src/lib/cloudinary.ts`
```typescript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };
```

#### File: `apps/api/src/middleware/upload.middleware.ts`
```typescript
import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'audio/mpeg', 'audio/wav'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('File type not allowed'));
  },
});
```

#### File: `apps/api/src/modules/media/media.service.ts`
```typescript
import { cloudinary } from '../../lib/cloudinary';
import { prisma } from '../../lib/prisma';

export class MediaService {
  async upload(userId: string, file: Express.Multer.File, invitationId?: string) {
    const folder = `invitely/${userId}`;

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'auto', quality: 'auto', fetch_format: 'auto' },
        (err, result) => err ? reject(err) : resolve(result)
      );
      stream.end(file.buffer);
    });

    const mediaType = file.mimetype.startsWith('image') ? 'IMAGE'
      : file.mimetype.startsWith('video') ? 'VIDEO' : 'AUDIO';

    const asset = await prisma.mediaAsset.create({
      data: {
        userId,
        invitationId,
        type: mediaType as any,
        url: result.secure_url,
        publicId: result.public_id,
        filename: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        width: result.width,
        height: result.height,
        duration: result.duration,
      }
    });

    return asset;
  }

  async getUserMedia(userId: string) {
    return prisma.mediaAsset.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteMedia(id: string, userId: string) {
    const asset = await prisma.mediaAsset.findFirst({ where: { id, userId } });
    if (!asset) throw Object.assign(new Error('Not found'), { statusCode: 404 });

    await cloudinary.uploader.destroy(asset.publicId, { resource_type: asset.type === 'IMAGE' ? 'image' : 'video' });
    await prisma.mediaAsset.delete({ where: { id } });
    return { message: 'Deleted' };
  }
}
```

#### Routes
```
POST   /api/media/upload       — upload file (auth, multipart/form-data)
GET    /api/media               — list user's media
DELETE /api/media/:id           — delete media
```

### 6.2 — Frontend: Media Upload Components

#### File: `apps/web/components/builder/MediaUploader.tsx`

A reusable upload component:
- Drag-and-drop zone with dashed border
- Click to browse
- Shows upload progress bar (axios `onUploadProgress`)
- Preview thumbnail after upload
- Used in: hero background, gallery images, music player

#### File: `apps/web/components/builder/MediaLibrary.tsx`

Modal that shows all uploaded media assets. User can:
- View all their uploads in a grid
- Select an existing asset (instead of re-uploading)
- Delete media assets

### 6.3 — Module 6 Checklist

- [ ] `POST /api/media/upload` accepts image/video/audio, uploads to Cloudinary, saves to DB
- [ ] Media assets linked to invitation correctly
- [ ] Drag-and-drop uploader component works in builder
- [ ] Upload progress bar visible during upload
- [ ] Media library modal shows all uploads
- [ ] Deleting media removes from Cloudinary + DB
- [ ] Builder gallery section displays uploaded images

---

## MODULE 7: Subscription & Payments Module

> **Goal:** Stripe subscriptions — FREE / BASIC / PREMIUM plans, upgrade/downgrade, billing portal, webhook handling.

### 7.1 — Plan Definitions

| Plan | Price | Invitations | Guests | Templates | Custom Domain |
|------|-------|-------------|--------|-----------|---------------|
| FREE | $0 | 1 | 50 | Free only | No |
| BASIC | $9/mo | 3 | 200 | All | No |
| PREMIUM | $19/mo | Unlimited | Unlimited | All + Custom | Yes |

### 7.2 — Backend: Payments Module

#### File: `apps/api/src/lib/stripe.ts`
```typescript
import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
```

#### File: `apps/api/src/modules/payments/payments.service.ts`

```typescript
// Methods to implement:

// createCheckoutSession(userId, priceId, plan)
//   — creates Stripe Checkout Session
//   — sets success_url and cancel_url
//   — returns { url }

// createBillingPortalSession(userId)
//   — creates Stripe Billing Portal session for subscription management
//   — returns { url }

// handleWebhook(event)
//   — switch on event.type:
//     'checkout.session.completed' → update subscription to active
//     'invoice.payment_succeeded'  → update currentPeriodEnd
//     'invoice.payment_failed'     → update status to PAST_DUE
//     'customer.subscription.deleted' → update status to CANCELED, downgrade to FREE

// getSubscription(userId)
//   — returns subscription with plan details
```

#### Routes
```
POST /api/payments/checkout       — create checkout session (auth)
POST /api/payments/portal         — billing portal session (auth)
GET  /api/payments/subscription   — get subscription status (auth)
POST /api/payments/webhook        — Stripe webhook (raw body, no auth)
```

> **IMPORTANT:** The webhook route must use `express.raw()` body parser, NOT `express.json()`.

### 7.3 — Frontend: Pricing & Billing

#### File: `apps/web/app/(dashboard)/billing/page.tsx`

Build a billing page with:
- **Current plan card**: shows plan name, renewal date, status badge
- **Plan comparison table** with all features per plan
- **Upgrade/Downgrade** buttons per plan:
  - Current plan → "Current Plan" (disabled)
  - Higher plan → "Upgrade" (calls checkout)
  - Lower plan → opens billing portal
- **Manage Billing** button → opens Stripe portal

#### File: `apps/web/app/(marketing)/pricing/page.tsx`

Public pricing page (on landing site):
- Animated pricing cards with annual/monthly toggle
- Feature list per plan
- CTA buttons leading to register/checkout

### 7.4 — Plan Enforcement

Add a middleware/guard that checks subscription plan before allowing:
- Creating more invitations than plan limit
- Using premium templates on FREE plan
- Accessing premium builder features

```typescript
// apps/api/src/middleware/plan.middleware.ts
export const requirePlan = (minPlan: 'BASIC' | 'PREMIUM') => async (req, res, next) => {
  const sub = await prisma.subscription.findUnique({ where: { userId: req.user.sub } });
  const planOrder = { FREE: 0, BASIC: 1, PREMIUM: 2, ENTERPRISE: 3 };
  if (planOrder[sub?.plan || 'FREE'] < planOrder[minPlan]) {
    return res.status(403).json({ message: 'Please upgrade your plan', upgradeRequired: true });
  }
  next();
};
```

### 7.5 — Module 7 Checklist

- [ ] Stripe products/prices created in Stripe dashboard (or via CLI) for BASIC + PREMIUM
- [ ] `POST /api/payments/checkout` redirects to Stripe Checkout
- [ ] Successful payment updates subscription in DB via webhook
- [ ] `POST /api/payments/portal` opens Stripe billing portal
- [ ] Webhook handler correctly processes all 4 event types
- [ ] Billing page shows current plan
- [ ] Upgrade flow works end-to-end (test mode)
- [ ] Plan limits enforced on invitation creation
- [ ] Premium templates gated behind paid plans

---

## MODULE 8: Admin Dashboard Module

> **Goal:** Full admin panel for platform management — users, invitations, revenue, templates.

### 8.1 — Backend: Admin Routes

All admin routes require `authenticate` + `requireRole('ADMIN', 'SUPER_ADMIN')` middleware.

#### Routes to implement:
```
GET  /api/admin/stats              — platform overview stats
GET  /api/admin/users              — paginated user list with filters
GET  /api/admin/users/:id          — user detail with invitations + subscription
PATCH /api/admin/users/:id         — update role, suspend account
GET  /api/admin/invitations        — all invitations with filters
DELETE /api/admin/invitations/:id  — remove invitation
GET  /api/admin/revenue            — revenue stats from Stripe
GET  /api/admin/templates          — manage templates
POST /api/admin/templates          — create template
PATCH /api/admin/templates/:id     — update template
DELETE /api/admin/templates/:id    — deactivate template
```

#### Admin Stats Response Shape:
```typescript
{
  users: { total: number, newThisMonth: number, verified: number },
  invitations: { total: number, published: number, drafts: number },
  rsvps: { total: number, accepted: number },
  revenue: { mrr: number, totalRevenue: number },
  plans: { free: number, basic: number, premium: number }
}
```

### 8.2 — Frontend: Admin Dashboard

#### Guard: `apps/web/app/(admin)/admin/layout.tsx`

Check `user.role === 'ADMIN'` — redirect non-admins to `/dashboard`.

#### File: `apps/web/app/(admin)/admin/page.tsx` — Overview

Build a stats dashboard:
- **KPI cards** (4 in a row): Total Users | Active Invitations | Total RSVPs | MRR
- **Charts** (use Recharts):
  - Line chart: New users per day (last 30 days)
  - Bar chart: Invitations created per week
  - Pie chart: Plan distribution (FREE / BASIC / PREMIUM)
- **Recent signups table**: Last 10 users

#### File: `apps/web/app/(admin)/admin/users/page.tsx` — User Management

- Paginated data table (10 per page)
- Columns: Avatar | Name | Email | Plan | Invitations | Joined | Actions
- Actions: View profile, Change role, Suspend/Unsuspend
- Search by name/email
- Filter by plan/role

#### File: `apps/web/app/(admin)/admin/templates/page.tsx` — Template Management

- List all templates
- Toggle active/inactive
- Edit template name, description, category
- Upload new thumbnail

### 8.3 — Module 8 Checklist

- [ ] Admin routes all protected with ADMIN role check
- [ ] Admin overview page shows correct platform stats
- [ ] Charts render with real data from DB
- [ ] User management table loads with pagination
- [ ] Admin can change user roles
- [ ] Template management CRUD works
- [ ] Non-admin users redirected away from admin routes

---

## MODULE 9: Analytics Module

> **Goal:** Track invitation views, RSVP conversions, traffic sources. Display in dashboard.

### 9.1 — Backend: Analytics

#### Track events on invitation views:
```typescript
// On GET /api/inv/:slug, after returning response, asynchronously:
await prisma.invitationAnalytics.create({
  data: {
    invitationId: invitation.id,
    event: 'view',
    source: parseSource(req.headers.referer),
    device: parseDevice(req.headers['user-agent']),
    ipAddress: req.ip,
  }
});
```

#### File: `apps/api/src/modules/analytics/analytics.service.ts`
```typescript
// Methods:
// getInvitationAnalytics(invitationId, userId, period: '7d'|'30d'|'90d')
//   Returns:
//   {
//     totalViews, uniqueViews, rsvpConversionRate,
//     viewsByDay: [{ date, views }],
//     topSources: [{ source, count }],
//     deviceBreakdown: [{ device, count }],
//   }
```

#### Route:
```
GET /api/analytics/:invitationId?period=30d   (auth, owner)
```

### 9.2 — Frontend: Analytics Dashboard

#### File: `apps/web/app/(dashboard)/invitations/[id]/analytics/page.tsx`

Build analytics page:
- **Period selector**: 7d / 30d / 90d
- **KPI cards**: Total Views | Unique Views | RSVP Rate | Avg. Daily Views
- **Line chart**: Views over time
- **Horizontal bar charts**: Traffic sources | Device breakdown
- **Mini insights**: "Peak day was Tuesday" / "40% of guests viewed on mobile"

### 9.3 — Module 9 Checklist

- [ ] View events tracked on every public invitation visit
- [ ] Analytics endpoint returns correct aggregated data
- [ ] Analytics page shows charts with real data
- [ ] Period filter (7d/30d/90d) works
- [ ] No performance impact on public page load (analytics async/non-blocking)

---

## MODULE 10: Deployment & DevOps

> **Goal:** Dockerize everything, set up CI/CD, environment configs for production.

### 10.1 — Docker

#### File: `apps/api/Dockerfile`
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 4000
CMD ["node", "dist/server.js"]
```

#### File: `docker-compose.prod.yml`
```yaml
version: '3.8'
services:
  api:
    build: ./apps/api
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    ports:
      - "4000:4000"
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}

volumes:
  postgres_data:
```

### 10.2 — GitHub Actions CI/CD

#### File: `.github/workflows/ci.yml`
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: invitely_test
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run lint
      - name: Run API tests
        working-directory: apps/api
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/invitely_test
          JWT_SECRET: test-secret
        run: |
          npx prisma migrate deploy
          npm test

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g vercel
      - run: vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        run: |
          curl -fsSL https://railway.app/install.sh | sh
          railway deploy --service api
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### 10.3 — Production Environment Checklist

- [ ] All secrets in GitHub Actions Secrets (never in code)
- [ ] Vercel project connected to GitHub repo
- [ ] Railway/Render project configured with env vars
- [ ] PostgreSQL database on Railway/Supabase/Neon
- [ ] Redis on Railway/Upstash
- [ ] Stripe webhook endpoint configured in Stripe dashboard pointing to production URL
- [ ] Cloudinary account configured
- [ ] Custom domain configured in Vercel
- [ ] SSL certificate active (auto via Vercel/Railway)
- [ ] Prisma migrations run automatically on deploy

### 10.4 — Final Production Checklist

- [ ] All 9 modules fully working end-to-end
- [ ] No hardcoded secrets anywhere
- [ ] All API routes have proper auth guards
- [ ] Rate limiting active on all public endpoints
- [ ] Error boundaries on all React pages
- [ ] Loading states on all async operations
- [ ] Mobile responsive (test at 375px, 768px, 1280px)
- [ ] Dark mode support via Tailwind `dark:` classes
- [ ] Lighthouse score > 85 on public invitation pages
- [ ] GDPR: cookie notice + privacy policy page

---

## Global Code Standards

### TypeScript
- Strict mode enabled everywhere
- No `any` except in middleware edge cases
- All API responses typed
- Zod for all request validation

### Error Handling
- All API errors return `{ message: string, errors?: object }`
- HTTP status codes used correctly (400 validation, 401 auth, 403 permission, 404 not found, 500 server)
- Frontend shows toast notifications for all errors

### Security
- Never return `passwordHash`, `emailVerifyToken`, or `resetPasswordToken` from any API endpoint
- All file uploads validated for type AND size
- SQL injection impossible via Prisma
- XSS protection via React's default escaping
- CSRF protection via SameSite cookies

### Performance
- All DB queries include only needed fields (`select`)
- Pagination on all list endpoints (default: 20, max: 100)
- Images served via Cloudinary CDN with auto-format/quality
- Redis cache for: public invitation pages (TTL 60s), template list (TTL 5min)

### UI/UX Standards
- Every loading state has a skeleton or spinner
- Every form has proper error messages below fields
- Every destructive action has a confirmation dialog
- Color scheme: Amber/Gold (#C9A84C) as primary throughout
- Font pairing: Playfair Display (headings) + Inter (body)
- Smooth transitions: `transition-all duration-200` as minimum

---

## Module Build Order Summary

```
Module 0: Setup         → Infrastructure foundation
Module 1: Database      → Schema + migrations + seed
Module 2: Auth          → ✅ Complete before anything else
Module 3: Templates     → Depends on Module 2
Module 4: Builder       → Depends on Modules 2, 3
Module 5: RSVP          → Depends on Module 4
Module 6: Media         → Can be done alongside Module 4
Module 7: Payments      → Depends on Module 2
Module 8: Admin         → Depends on all above
Module 9: Analytics     → Depends on Modules 4, 5
Module 10: Deploy       → Last
```

**Start each module fresh. Finish it completely (backend + frontend + tested) before moving on.**

---

*Built for Invitely — Premium Digital Wedding Invitations Platform*
*Architecture by Claude Code · Version 1.0*
