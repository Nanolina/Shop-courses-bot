import { Module } from '@nestjs/common';
import { CourseCustomerService } from '../course/services';
import { LoggerModule } from '../logger/logger.module';
import { PointsService } from '../points/points.service';
import { PrismaService } from '../prisma/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
import { TelegramUtilsService } from '../telegram-bot/telegram-utils.service';
import { TonMonitorService } from './ton-monitor.service';
import { TonController } from './ton.controller';
import { TonService } from './ton.service';

@Module({
  imports: [LoggerModule],
  controllers: [TonController],
  providers: [
    TonService,
    TonMonitorService,
    PrismaService,
    SocketGateway,
    PointsService,
    TelegramUtilsService,
    CourseCustomerService,
  ],
})
export class TonModule {}
