import { Injectable } from '@nestjs/common';
import { MyLogger } from '../../logger/my-logger.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CourseAllUsersService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
  ) {}

  async findAll() {
    return await this.prisma.course.findMany({
      where: {
        isActive: true,
      },
    });
  }

  async findAllCoursesOneCategory(category: string) {
    return await this.prisma.course.findMany({
      where: {
        category,
        isActive: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.course.findFirst({
      where: {
        id,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            modules: true,
            purchases: true,
          },
        },
      },
    });
  }
}
