import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Course } from '@prisma/client';
import { User } from '@tma.js/init-data-node';
import { Redis } from 'ioredis';
import { MyLogger } from '../../logger/my-logger.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CourseCustomerService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async findAllPurchasedCourses(userId: number): Promise<Course[]> {
    return await this.prisma.course.findMany({
      where: {
        purchases: {
          some: {
            customerId: userId,
          },
        },
      },
    });
  }

  async purchase(
    id: string,
    hasAcceptedTerms: boolean,
    user: User,
  ): Promise<void> {
    const userId = user.id;
    const course = await this.prisma.course.findFirst({
      where: {
        id,
        isActive: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Get chatId by userId from Redis
    const chatId = BigInt(await this.redis.get(`userId:${userId}`));

    try {
      await this.prisma.coursePurchase.create({
        data: {
          hasAcceptedTerms,
          sellerId: course.userId,
          customer: {
            connectOrCreate: {
              where: {
                id: userId,
              },
              create: {
                id: userId,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                ...(chatId && {
                  chatId,
                }),
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
