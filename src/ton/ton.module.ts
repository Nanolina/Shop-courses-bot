import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CourseCustomerService, CourseSellerService } from '../course/services';
import { ImageService } from '../image/image.service';
import { LoggerModule } from '../logger/logger.module';
import { PointsService } from '../points/points.service';
import { PrismaService } from '../prisma/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
import { TelegramUtilsService } from '../telegram-bot/telegram-utils.service';
import { TonMonitorService } from './ton-monitor.service';
import { TonController } from './ton.controller';
import { TonService } from './ton.service';

@Module({
  imports: [
    LoggerModule,
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL,
    }),
  ],
  controllers: [TonController],
  providers: [
    TonService,
    TonMonitorService,
    PrismaService,
    SocketGateway,
    PointsService,
    TelegramUtilsService,
    CourseCustomerService,
    CourseSellerService,
    ImageService,
    CloudinaryService,
  ],
})
export class TonModule {}
