import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { config } from 'dotenv';
import { SocketModule } from 'src/socket/socket.module';
import { CourseModule } from '../course/course.module';
import { LoggerModule } from '../logger/logger.module';
import { PointsModule } from '../points/points.module';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramModule } from '../telegram-bot/telegram.module';
import { TonMonitorService } from './ton-monitor.service';
import { TonController } from './ton.controller';
import { TonService } from './ton.service';
config();

@Module({
  imports: [
    LoggerModule,
    SocketModule,
    PointsModule,
    TelegramModule,
    CourseModule,
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL,
    }),
  ],
  controllers: [TonController],
  providers: [TonService, TonMonitorService, PrismaService],
})
export class TonModule {}
