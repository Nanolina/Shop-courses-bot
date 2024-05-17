import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ImageService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
    private readonly logger: MyLogger,
  ) {}

  async upload(temporaryImageUrl: string, courseId: string, userId: number) {
    // Try to get the current image for the course
    const course = await this.prisma.course.findFirst({
      where: {
        userId,
        id: courseId,
      },
    });

    // Delete the old image from Cloudinary
    if (course && course.imageUrl && course.imagePublicId) {
      try {
        await this.cloudinaryService.deleteFile(course.imagePublicId);
      } catch (error) {
        this.logger.error({
          method: 'image-delete-cloudinary',
          error,
        });
      }
    }

    // Upload a new image to Cloudinary
    let imageFromCloudinary;
    try {
      imageFromCloudinary =
        await this.cloudinaryService.uploadImageUrl(temporaryImageUrl);
    } catch (error) {
      this.logger.error({ method: 'image-upload-cloudinary', error });
      throw new Error('Failed to upload new image');
    }

    return await this.prisma.course.update({
      where: {
        userId,
        id: courseId,
      },
      data: {
        imageUrl: imageFromCloudinary?.url,
        imagePublicId: imageFromCloudinary?.public_id,
      },
    });
  }
}
