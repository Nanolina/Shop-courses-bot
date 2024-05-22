import { Injectable } from '@nestjs/common';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { CourseCreatedDto, CourseUpdatedDto } from './dto';

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

  async create(dto: CourseCreatedDto) {
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
      this.logger.error({ method: 'course-create', error });
      return null;
    }
  }

  async findAll() {
    return await this.prisma.course.findMany(include);
  }

  async findAllCreatedCoursesByUser(userId: string) {
    return await this.prisma.course.findMany({
      where: {
        userId: parseInt(userId),
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

  async update(courseId: string, dto: CourseUpdatedDto) {
    try {
      return await this.prisma.course.update({
        where: {
          id: courseId,
          userId: dto.userId,
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
      this.logger.error({ method: 'course-update', error });
      return null;
    }
  }
}
