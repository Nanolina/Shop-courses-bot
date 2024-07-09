import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@tma.js/init-data-node';
import { randomInt } from 'crypto';
import { calculateEndDate, convertToNumber } from '../functions';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChangeEmailDto, UpdateDto } from './dto';
import { GetEmailCodeResponse, GetUserDataResponse } from './types';

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

  async savePhone(user: User, phone: string) {
    try {
      await this.prisma.user.upsert({
        where: {
          id: user.id,
        },
        update: {
          phone,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
        },
        create: {
          phone,
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
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

  async verifyCode(id: number, codeEmail: string): Promise<void> {
    const codeEmailNumber = convertToNumber(codeEmail);
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        codeEmail: codeEmailNumber,
        codeEmailExpiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      throw new ForbiddenException('Invalid code');
    }
  }

  async getEmailCode(id: number): Promise<GetEmailCodeResponse> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    return {
      email: user.email,
      code: user.codeEmail,
    };
  }

  async update(id: number, dto: UpdateDto): Promise<void> {
    try {
      await this.prisma.user.upsert({
        where: {
          id,
        },
        update: {
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
        create: {
          id,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong with updating data',
        error?.message,
      );
    }
  }
}
