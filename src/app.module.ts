import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CourseModule } from './course/course.module';
import { ImageService } from './image/image.service';
import { LoggerModule } from './logger/logger.module';
import { ModuleModule } from './module/module.module';
import { PrismaService } from './prisma/prisma.service';
import { RedisAppModule } from './redis/redis.module';
import { TelegramModule } from './telegram-bot/telegram.module';
import { LessonModule } from './lesson/lesson.module';

@Module({
  imports: [
    CourseModule,
    RedisAppModule,
    CloudinaryModule,
    ModuleModule,
    LoggerModule,
    TelegramModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LessonModule,
  ],
  providers: [PrismaService, ImageService],
})
export class AppModule {}
