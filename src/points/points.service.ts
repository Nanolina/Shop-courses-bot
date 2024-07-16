import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ReasonType } from '@prisma/client';
import { pointsNumber } from '../data';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PointsService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
  ) {}

  async get(userId: number): Promise<number> {
    const result = await this.prisma.points.aggregate({
      where: {
        userId,
      },
      _sum: {
        points: true,
      },
    });

    return result._sum.points ?? 0;
  }

  async add(
    courseId: string,
    userId: number,
    reasonType: ReasonType,
  ): Promise<number> {
    try {
      await this.prisma.points.create({
        data: {
          points: pointsNumber,
          reason: reasonType,
          referenceId: courseId,
          userId,
        },
      });

      return await this.get(userId);
    } catch (error) {
      this.logger.error({
        method: 'points-add',
        error: error?.message,
      });
      throw new InternalServerErrorException(
        'Failed to add points',
        error?.message,
      );
    }
  }
}
