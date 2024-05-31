import { Module } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { LoggerModule } from '../logger/logger.module';
import { ImageService } from '../media/image.service';
import { VideoService } from '../media/video.service';
import { PrismaService } from '../prisma/prisma.service';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';

@Module({
  imports: [LoggerModule],
  controllers: [LessonController],
  providers: [
    LessonService,
    PrismaService,
    ImageService,
    VideoService,
    CloudinaryService,
  ],
})
export class LessonModule {}
