import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CourseModule } from './course/course.module';
import { EmailModule } from './email/email.module';
import { ImageModule } from './image/image.module';
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
    ImageModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get('CACHE_TTL'),
        store: (await redisStore({
          url: configService.get('REDIS_URL'),
        })) as unknown as CacheStore,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [PrismaService],
})
export class AppModule {}
