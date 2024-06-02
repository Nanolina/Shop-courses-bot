import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CourseModule } from './course/course.module';
import { LessonModule } from './lesson/lesson.module';
import { LoggerModule } from './logger/logger.module';
import { ModuleModule } from './module/module.module';
import { PrismaService } from './prisma/prisma.service';
import { SocketModule } from './socket/socket.module';
import { TelegramModule } from './telegram-bot/telegram.module';

@Module({
  imports: [
    CloudinaryModule,
    CourseModule,
    ModuleModule,
    LoggerModule,
    TelegramModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LessonModule,
    SocketModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
