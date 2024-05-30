import { Injectable } from '@nestjs/common';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto, DeleteCourseDto, UpdateCourseDto } from './dto';

const include = {
  include: {
    modules: {
      include: {
        lessons: true,
      },
    },
  },
};

@Injectable()
export class CourseService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
  ) {}

  async create(dto: CreateCourseDto) {
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
                id: dto.userId,
              },
              create: {
                id: dto.userId,
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error({ method: 'course-create', error: error?.message });
      return null;
    }
  }

  async findAll() {
    return await this.prisma.course.findMany(include);
  }

  async findAllCoursesOneCategory(category: string) {
    return await this.prisma.course.findMany({
      where: {
        category,
      },
    });
  }

  async findAllCreatedCoursesByUser(userId: number) {
    return await this.prisma.course.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      ...include,
    });
  }

  async findOne(id: string) {
    return await this.prisma.course.findFirst({
      where: {
        id,
      },
      ...include,
    });
  }

  async findWithCount(id: string) {
    return await this.prisma.course.findFirst({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            modules: true,
          },
        },
      },
    });
  }

  async update(dto: UpdateCourseDto) {
    try {
      return await this.prisma.course.update({
        where: {
          id: dto.courseId,
          user: {
            id: dto.userId,
          },
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
      return null;
    }
  }

  async delete(dto: DeleteCourseDto) {
    try {
      // Course
      const deletedCourse = await this.prisma.course.update({
        where: {
          id: dto.id,
          user: {
            id: dto.userId,
          },
        },
        data: {
          isActive: false,
        },
      });

      // Modules
      await this.prisma.module.deleteMany({
        where: {
          course: {
            id: dto.id,
            user: {
              id: dto.userId,
            },
          },
        },
      });

      // Lessons
      await this.prisma.lesson.deleteMany({
        where: {
          module: {
            course: {
              id: dto.id,
              user: {
                id: dto.userId,
              },
            },
          },
        },
      });

      return deletedCourse;
    } catch (error) {
      this.logger.error({ method: 'course-delete', error: error?.message });
      return null;
    }
  }
}
