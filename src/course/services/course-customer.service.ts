import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MyLogger } from '../../logger/my-logger.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PurchaseCourseDto } from '../dto';

@Injectable()
export class CourseCustomerService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
  ) {}

  async findAllPurchasedCourses(userId: number) {
    return await this.prisma.coursePurchase.findMany({
      where: {
        customerId: userId,
      },
    });
  }

  async findOnePurchasedCourse(id: string, userId: number) {
    return await this.prisma.coursePurchase.findMany({
      where: {
        courseId: id,
        customerId: userId,
      },
    });
  }

  async purchase(id: string, userId: number, dto: PurchaseCourseDto) {
    const course = await this.prisma.course.findFirst({
      where: {
        id,
        isActive: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    try {
      return await this.prisma.coursePurchase.create({
        data: {
          sellerId: course.userId,
          walletAddressSeller: course.walletAddressSeller,
          walletAddressCustomer: dto.walletAddressCustomer,
          customer: {
            connectOrCreate: {
              where: {
                id: userId,
              },
              create: {
                id: userId,
              },
            },
          },
          course: {
            connect: {
              id,
              isActive: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error({ method: 'course-purchase', error: error?.message });
      throw new InternalServerErrorException(
        'Failed to purchase course',
        error?.message,
      );
    }
  }
}
