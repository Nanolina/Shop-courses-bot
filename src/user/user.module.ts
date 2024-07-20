import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [LoggerModule, EmailModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
