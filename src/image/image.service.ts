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

  async upload(temporaryImageUrl: string, courseId: string) {
    // Try to get the current image for the course
    const currentImage = await this.prisma.image.findUnique({
      where: {
        type: 'Course',
        typeId: courseId,
      },
    });

    // Delete the old image from Cloudinary
    if (currentImage && currentImage.publicId) {
      try {
        await this.cloudinaryService.deleteFile(currentImage.publicId);
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

    return await this.prisma.image.upsert({
      where: {
        type: 'Course',
        typeId: courseId,
      },
      create: {
        type: 'Course',
        typeId: courseId,
        url: imageFromCloudinary?.url,
        publicId: imageFromCloudinary?.public_id,
      },
      update: {
        url: imageFromCloudinary?.url,
        publicId: imageFromCloudinary?.public_id,
      },
    });
  }
}
