import { Module } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ImageService } from '../image/image.service';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';

@Module({
  imports: [LoggerModule],
  controllers: [LessonController],
  providers: [LessonService, PrismaService, ImageService, CloudinaryService],
})
export class LessonModule {}
