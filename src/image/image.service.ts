import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
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

  async deleteImageFromCloudinary(courseId: string, userId: number) {
    const course = await this.prisma.course.findFirst({
      where: {
        userId,
        id: courseId,
      },
    });

    if (course && course.imageUrl && course.imagePublicId) {
      try {
        await this.cloudinaryService.deleteFile(course.imagePublicId);
      } catch (error) {
        this.logger.error({ method: 'deleteImageFromCloudinary', error });
        throw new NotImplementedException(
          'Failed to delete an image from Cloudinary',
        );
      }
    }
  }

  async upload(file: Express.Multer.File, courseId?: string, userId?: number) {
    if (!file) throw new BadRequestException('No image file provided');

    if (courseId && userId) {
      await this.deleteImageFromCloudinary(courseId, userId);
    }

    return await this.cloudinaryService.uploadFile(file, 'course');
  }
}
