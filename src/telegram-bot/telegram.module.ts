import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from '../course/course.module';
import { CourseService } from '../course/course.service';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramListenersService } from './telegram-listeners.service';
import { TelegramUtilsService } from './telegram-utils.service';

@Module({
  imports: [ConfigModule, CourseModule, LoggerModule],
  providers: [
    TelegramBotService,
    TelegramListenersService,
    TelegramUtilsService,
    PrismaService,
    CourseService,
  ],
  exports: [TelegramBotService],
})
export class TelegramModule {}
