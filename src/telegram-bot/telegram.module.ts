import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Redis } from 'ioredis';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CourseModule } from '../course/course.module';
import { CourseService } from '../course/course.service';
import { ImageService } from '../image/image.service';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramListenersService } from './telegram-listeners.service';
import { TelegramUtilsService } from './telegram-utils.service';

@Module({
  imports: [
    ConfigModule,
    RedisModule,
    CourseModule,
    LoggerModule,
    CloudinaryModule,
  ],
  providers: [
    TelegramBotService,
    TelegramListenersService,
    TelegramUtilsService,
    ImageService,
    PrismaService,
    CourseService,
    Redis,
  ],
  exports: [TelegramBotService],
})
export class TelegramModule {}
