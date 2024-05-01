import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [LoggerModule],
  controllers: [CourseController],
  providers: [CourseService, PrismaService],
})
export class CourseModule {}
