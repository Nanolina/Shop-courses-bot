import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Course } from '@prisma/client';
import { Cache } from 'cache-manager';
import { ImageService } from '../../image/image.service';
import { MyLogger } from '../../logger/my-logger.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from '../dto';

@Injectable()
export class CourseSellerService {
  constructor(
    private prisma: PrismaService,
    private imageService: ImageService,
    private readonly logger: MyLogger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(
    userId: number,
    dto: CreateCourseDto,
    file: Express.Multer.File,
  ): Promise<Course> {
    try {
      let imageInCloudinary;

      // If the user sends both a link to an image and a file, we take only the link
      if (file && !dto.imageUrl) {
        try {
          imageInCloudinary = await this.imageService.upload(file, 'course');
        } catch (error) {
          this.logger.error({ method: 'course-create-cloudinary', error });
        }
      }

      const course = await this.prisma.course.create({
        data: {
          name: dto.name,
          description: dto.description,
          category: dto.category,
          subcategory: dto.subcategory,
          price: parseFloat(dto.price),
          currency: dto.currency,
          imageUrl: dto.imageUrl || imageInCloudinary?.url,
          ...(imageInCloudinary && {
            imagePublicId: imageInCloudinary?.public_id,
          }),
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      // Invalidate cache
      await this.cacheManager.reset();

      return course;
    } catch (error) {
      this.logger.error({ method: 'course-create', error: error?.message });
      throw new InternalServerErrorException(
        'Failed to create course',
        error?.message,
      );
    }
  }

  async findAllCreatedCourses(userId: number) {
    return await this.prisma.course.findMany({
      where: {
        userId,
        isActive: true,
      },
    });
  }

  async update(
    id: string,
    userId: number,
    dto: UpdateCourseDto,
    file: Express.Multer.File,
  ): Promise<Course> {
    try {
      const oldCourse = await this.prisma.course.findFirst({
        where: {
          id,
          userId,
          isActive: true,
        },
      });

      const { imageUrl, imagePublicId } = await this.imageService.getImageUrl(
        'course',
        oldCourse,
        dto,
        file,
      );

      const course = await this.prisma.course.update({
        where: {
          id,
          userId,
          isActive: true,
        },
        data: {
          imageUrl,
          imagePublicId,
          name: dto.name,
          description: dto.description,
          category: dto.category,
          subcategory: dto.subcategory,
          price: parseFloat(dto.price),
          currency: dto.currency,
        },
      });

      // Invalidate cache
      await this.cacheManager.reset();

      return course;
    } catch (error) {
      this.logger.error({ method: 'course-update', error: error?.message });
      throw new InternalServerErrorException(
        'Failed to update course',
        error?.message,
      );
    }
  }

  async delete(id: string, userId: number): Promise<void> {
    try {
      // Course
      await this.prisma.course.update({
        where: {
          id,
          userId,
        },
        data: {
          isActive: false,
        },
      });

      // Modules
      await this.prisma.module.deleteMany({
        where: {
          course: {
            id,
            userId,
          },
        },
      });

      // Lessons
      await this.prisma.lesson.deleteMany({
        where: {
          module: {
            course: {
              id,
              userId,
            },
          },
        },
      });

      // Invalidate cache
      await this.cacheManager.reset();
    } catch (error) {
      this.logger.error({ method: 'course-delete', error: error?.message });
      throw new InternalServerErrorException(
        'Failed to delete course',
        error?.message,
      );
    }
  }

  async changeHasAcceptedTerms(
    id: string,
    userId: number,
    hasAcceptedTerms: boolean,
  ): Promise<void> {
    try {
      await this.prisma.course.update({
        where: {
          id,
          userId,
        },
        data: {
          hasAcceptedTerms,
        },
      });
    } catch (error) {
      this.logger.error({
        method: 'course-changeHasAcceptedTerms',
        error: error?.message,
      });
      throw new InternalServerErrorException(
        'Failed to change field to accept terms',
        error?.message,
      );
    }
  }
}
