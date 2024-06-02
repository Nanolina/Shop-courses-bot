import { Injectable, NotFoundException } from '@nestjs/common';
import { CUSTOMER, SELLER, USER } from '../../consts';
import { MyLogger } from '../../logger/my-logger.service';
import { PrismaService } from '../../prisma/prisma.service';

const include = {
  include: {
    _count: {
      select: {
        modules: true,
        purchases: true,
      },
    },
  },
};

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

  async findOne(id: string, userId: number) {
    const customerCourse = await this.prisma.course.findFirst({
      where: {
        id,
        purchases: {
          some: {
            customerId: userId,
            courseId: id,
          },
        },
      },
      ...include,
    });

    if (customerCourse) {
      return {
        role: CUSTOMER,
        course: customerCourse,
      };
    }

    const sellerCourse = await this.prisma.course.findFirst({
      where: {
        id,
        userId,
        isActive: true,
      },
      ...include,
    });

    if (sellerCourse) {
      return {
        role: SELLER,
        course: sellerCourse,
      };
    }

    // not buyer, not seller
    const userCourse = await this.prisma.course.findFirst({
      where: {
        id,
        isActive: true,
      },
      ...include,
    });

    if (!userCourse) {
      throw new NotFoundException('Course not found');
    }

    return {
      role: USER,
      course: userCourse,
    };
  }
}
