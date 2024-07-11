import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from '@prisma/client';
import { CUSTOMER, SELLER, USER } from '../../consts';
import { PrismaService } from '../../prisma/prisma.service';
import { FindOneResponse } from '../types';

@Injectable()
export class CourseAllUsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Course[]> {
    return await this.prisma.course.findMany({
      where: {
        isActive: true,
      },
    });
  }

  async findAllCoursesOneCategory(category: string): Promise<Course[]> {
    return await this.prisma.course.findMany({
      where: {
        category,
        isActive: true,
      },
    });
  }

  async findOne(id: string, userId: number): Promise<FindOneResponse> {
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
