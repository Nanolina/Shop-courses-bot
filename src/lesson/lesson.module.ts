import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';

@Module({
  imports: [LoggerModule],
  controllers: [LessonController],
  providers: [LessonService, PrismaService],
})
export class LessonModule {}
