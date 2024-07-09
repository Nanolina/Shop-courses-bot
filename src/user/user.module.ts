import { Module } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [LoggerModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, EmailService],
})
export class UserModule {}
