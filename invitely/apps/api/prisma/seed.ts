import { PrismaClient, TemplateCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
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
      thumbnailUrl: null,
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
      thumbnailUrl: null,
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
      thumbnailUrl: null,
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
      thumbnailUrl: null,
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
      thumbnailUrl: null,
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
