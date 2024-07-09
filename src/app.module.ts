import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CourseModule } from './course/course.module';
import { EmailModule } from './email/email.module';
import { LessonModule } from './lesson/lesson.module';
import { LoggerModule } from './logger/logger.module';
import { ModuleModule } from './module/module.module';
import { PointsModule } from './points/points.module';
import { PrismaService } from './prisma/prisma.service';
import { SocketModule } from './socket/socket.module';
import { TelegramModule } from './telegram-bot/telegram.module';
import { TonModule } from './ton/ton.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    CloudinaryModule,
    CourseModule,
    ModuleModule,
    LoggerModule,
    TelegramModule,
    LessonModule,
    SocketModule,
    PointsModule,
    TonModule,
    EmailModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [PrismaService],
})
export class AppModule {}
