import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PointsService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
  ) {}

  async get(userId: number): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { points: true },
    });

    return user?.points || 0;
  }

  async addPointsForCourseCreation(
    courseId: string,
    userId: number,
  ): Promise<number> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
          courses: {
            some: {
              id: courseId,
              userId,
            },
          },
        },
        data: {
          points: {
            increment: 20,
          },
        },
      });

      return user.points;
    } catch (error) {
      this.logger.error({
        method: 'points-addPointsForCourseCreation',
        error: error?.message,
      });
      throw new InternalServerErrorException(
        'Failed to add course creation points',
        error?.message,
      );
    }
  }

  async addPointsForCoursePurchase(userId: number): Promise<number> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          points: {
            increment: 20,
          },
        },
      });

      return user.points;
    } catch (error) {
      this.logger.error({
        method: 'points-addPointsForCoursePurchase',
        error: error?.message,
      });
      throw new InternalServerErrorException(
        'Failed to add course purchase points',
        error?.message,
      );
    }
  }
}
