import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { GetUserDataResponse } from './types';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
  ) {}

  async getUserData(id: number): Promise<GetUserDataResponse> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    return {
      phone: user.phone,
      email: user.email,
    };
  }

  async savePhone(id: number, phone: string) {
    try {
      await this.prisma.user.upsert({
        where: {
          id,
        },
        update: {
          phone,
        },
        create: {
          id,
          phone,
        },
      });
    } catch (error) {
      this.logger.error({ method: 'user-savePhone', error: error?.message });
      throw new InternalServerErrorException(
        'Failed to save phone',
        error?.message,
      );
    }
  }
}
