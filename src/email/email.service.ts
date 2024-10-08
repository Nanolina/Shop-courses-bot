import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { CodeDto } from './dto';

@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly logger: MyLogger,
  ) {}

  async sendCode(userId: number, dto: CodeDto): Promise<void> {
    const { email, code } = dto;
    const subject = `Your code: ${code}`;
    const template = 'CODE';

    let newEmail;
    try {
      newEmail = await this.prisma.email.create({
        data: {
          userId,
          email,
          subject,
          template,
          code,
        },
      });
    } catch (error) {
      this.logger.error({
        method: 'email-sendCode-create',
        error,
      });

      throw new InternalServerErrorException(
        'Failed to create email record',
        error?.message,
      );
    }

    try {
      const minutesFromEnv = this.configService.get<string>(
        'EMAIL_CODE_EXPIRES_IN',
      );
      // Don't take last letter
      const minutes = minutesFromEnv.slice(0, minutesFromEnv.length - 1);

      await this.mailerService.sendMail({
        subject,
        template,
        to: email,
        from: `"No Reply" <${this.configService.get<string>('SMTP_USER')}>`,
        headers: {
          'X-Priority': '1 (Highest)',
          'X-MSMail-Priority': 'High',
          Importance: 'High',
        },
        context: {
          code,
          minutes,
        },
      });
    } catch (error) {
      await this.prisma.email.update({
        where: {
          id: newEmail?.id,
        },
        data: {
          errorMessage: error?.message || error,
        },
      });

      this.logger.error({ method: 'email-sendCode-send', error });
      throw new InternalServerErrorException(
        'Something went wrong with sending email',
        error?.message,
      );
    }
  }
}
