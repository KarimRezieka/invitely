import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/redis';

export class TemplatesService {
  async getTemplates(filters: { category?: string; isPremium?: string; search?: string }) {
    const cacheKey = `templates:${JSON.stringify(filters)}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const templates = await prisma.template.findMany({
      where: {
        isActive: true,
        ...(filters.category && { category: filters.category as any }),
        ...(filters.isPremium !== undefined && { isPremium: filters.isPremium === 'true' }),
        ...(filters.search && {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
          ]
        }),
      },
      orderBy: [{ isPremium: 'asc' }, { sortOrder: 'asc' }],
    });

    await redis.setex(cacheKey, 300, JSON.stringify(templates));
    return templates;
  }

  async getTemplateBySlug(slug: string) {
    const template = await prisma.template.findUnique({ where: { slug } });
    if (!template) throw Object.assign(new Error('Template not found'), { statusCode: 404 });
    return template;
  }

  async getTemplateById(id: string) {
    const template = await prisma.template.findUnique({ where: { id } });
    if (!template) throw Object.assign(new Error('Template not found'), { statusCode: 404 });
    return template;
  }

  async createTemplate(data: any) {
    const template = await prisma.template.create({ data });
    await redis.del('templates:*');
    return template;
  }

  async updateTemplate(id: string, data: any) {
    const template = await prisma.template.update({ where: { id }, data });
    return template;
  }

  async toggleTemplate(id: string) {
    const template = await prisma.template.findUnique({ where: { id } });
    if (!template) throw Object.assign(new Error('Template not found'), { statusCode: 404 });
    return prisma.template.update({ where: { id }, data: { isActive: !template.isActive } });
  }
}
