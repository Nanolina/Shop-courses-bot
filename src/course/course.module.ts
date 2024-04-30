import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [LoggerModule, CloudinaryModule],
  controllers: [CourseController],
  providers: [CourseService, PrismaService],
})
export class CourseModule {}
