import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [LoggerModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
