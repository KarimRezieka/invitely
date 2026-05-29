import { cloudinary } from '../../lib/cloudinary';
import { prisma } from '../../lib/prisma';

export class MediaService {
  async upload(userId: string, file: Express.Multer.File, invitationId?: string) {
    const folder = `invitely/${userId}`;

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'auto', quality: 'auto', fetch_format: 'auto' },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(file.buffer);
    });

    const mediaType = file.mimetype.startsWith('image')
      ? 'IMAGE'
      : file.mimetype.startsWith('video')
      ? 'VIDEO'
      : 'AUDIO';

    return prisma.mediaAsset.create({
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
      },
    });
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

    const resourceType = asset.type === 'IMAGE' ? 'image' : 'video';
    await cloudinary.uploader.destroy(asset.publicId, { resource_type: resourceType });
    await prisma.mediaAsset.delete({ where: { id } });
    return { message: 'Deleted' };
  }
}
