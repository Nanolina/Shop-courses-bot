import { Injectable } from '@nestjs/common';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PointsService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
  ) {}

  async add(userId: number, points: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { points: { increment: points } },
    });
  }

  async get(userId: number): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { points: true },
    });

    return user.points;
  }
}
