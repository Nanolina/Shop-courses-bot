import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MyLogger } from '../../logger/my-logger.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from '../dto';

@Injectable()
export class CourseSellerService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
  ) {}

  async create(userId: number, dto: CreateCourseDto) {
    try {
      return await this.prisma.course.create({
        data: {
          name: dto.name,
          description: dto.description,
          category: dto.category,
          subcategory: dto.subcategory,
          price: dto.price,
          currency: dto.currency,
          walletAddressSeller: dto.walletAddressSeller,
          imageUrl: dto.imageUrl,
          user: {
            connectOrCreate: {
              where: {
                id: userId,
              },
              create: {
                id: userId,
              },
            },
          },
        },
      });
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

  async findOneCreatedCourse(id: string, userId: number) {
    return await this.prisma.course.findFirst({
      where: {
        id,
        userId,
        isActive: true,
      },
    });
  }

  async update(id: string, userId: number, dto: UpdateCourseDto) {
    try {
      return await this.prisma.course.update({
        where: {
          id,
          userId,
          isActive: true,
        },
        data: {
          name: dto.name,
          description: dto.description,
          category: dto.category,
          subcategory: dto.subcategory,
          price: dto.price,
          currency: dto.currency,
          walletAddressSeller: dto.walletAddressSeller,
          imageUrl: dto.imageUrl,
        },
      });
    } catch (error) {
      this.logger.error({ method: 'course-update', error: error?.message });
      throw new InternalServerErrorException(
        'Failed to update course',
        error?.message,
      );
    }
  }

  async delete(id: string, userId: number) {
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

      return true;
    } catch (error) {
      this.logger.error({ method: 'course-delete', error: error?.message });
      throw new InternalServerErrorException(
        'Failed to delete course',
        error?.message,
      );
    }
  }
}
