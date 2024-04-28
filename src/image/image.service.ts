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

  async upload(image: any, courseId: string) {
    // Upload image to Cloudinary
    let imageFromCloudinary;
    if (image) {
      try {
        imageFromCloudinary = await this.cloudinaryService.uploadImage(image);
      } catch (error) {
        this.logger.error({ method: 'image-upload-cloudinary', error });
      }
    }

    return await this.prisma.image.create({
      data: {
        courseId,
        url: imageFromCloudinary?.url,
        publicId: imageFromCloudinary?.public_id,
      },
    });
  }
}
