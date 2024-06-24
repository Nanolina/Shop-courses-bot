import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';

@Module({
  imports: [LoggerModule],
  controllers: [PointsController],
  providers: [PointsService, PrismaService],
})
export class PointsModule {}
