import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'crypto';
import { calculateEndDate } from '../functions';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChangeEmailDto } from './dto';
import { GetUserDataResponse } from './types';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
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

  private generateEmailCode(): number {
    return randomInt(100000, 1000000);
  }

  private getCodeExpirationDate(): Date {
    const codeExpires = this.configService.get<string>('EMAIL_CODE_EXPIRES_IN');
    return calculateEndDate(codeExpires);
  }

  private async saveUserCodeData(
    id: number,
    dto: ChangeEmailDto,
    codeEmail: number,
    codeEmailExpiresAt: Date,
  ) {
    try {
      await this.prisma.user.upsert({
        where: {
          id,
        },
        update: {
          codeEmail,
          codeEmailExpiresAt,
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
        create: {
          id,
          codeEmail,
          codeEmailExpiresAt,
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });
    } catch (error) {
      this.logger.error({
        method: 'user-saveUserCodeData',
        error: error?.message,
      });
      throw new InternalServerErrorException(
        'Failed to save user code data',
        error?.message,
      );
    }
  }

  async generateCode(id: number, dto: ChangeEmailDto): Promise<number> {
    const codeEmail = this.generateEmailCode();
    const codeEmailExpiresAt = this.getCodeExpirationDate();

    await this.saveUserCodeData(id, dto, codeEmail, codeEmailExpiresAt);
    return codeEmail;
  }
}
