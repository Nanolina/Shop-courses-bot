import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'crypto';
import { UserFromTG } from 'types';
import { EmailService } from '../email/email.service';
import { calculateEndDate, convertToNumber } from '../functions';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDto } from './dto';
import { GetUserDataResponse } from './types';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private emailService: EmailService,
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
      isVerifiedEmail: user.isVerifiedEmail,
    };
  }

  async savePhone(user: UserFromTG, phone: string) {
    try {
      await this.prisma.user.upsert({
        where: {
          id: user.id,
        },
        update: {
          phone,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
        },
        create: {
          phone,
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
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

  async update(id: number, dto: UpdateDto) {
    const { email, firstName, lastName } = dto;
    try {
      let codeEmail;
      let codeEmailExpiresAt;

      if (email) {
        codeEmail = this.generateEmailCode();
        codeEmailExpiresAt = this.getCodeExpirationDate();
      }

      await this.prisma.user.upsert({
        where: {
          id,
        },
        update: {
          ...(firstName && {
            firstName,
          }),
          ...(lastName && {
            lastName,
          }),
          ...(email && {
            email,
            isVerifiedEmail: false,
            codeEmail,
            codeEmailExpiresAt,
          }),
        },
        create: {
          id,
          email,
          firstName,
          lastName,
          codeEmail,
          codeEmailExpiresAt,
        },
      });

      if (email) {
        await this.emailService.sendCode(id, {
          email,
          code: codeEmail,
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update data',
        error?.message,
      );
    }
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

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isVerifiedEmail: true,
      },
    });
  }
}
