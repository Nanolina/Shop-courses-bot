import { Module } from '@nestjs/common';
import { LessonService } from '../lesson/lesson.service';
import { LoggerModule } from '../logger/logger.module';
import { ImageService } from '../media/image.service';
import { VideoService } from '../media/video.service';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [LoggerModule],
  controllers: [CloudinaryController],
  providers: [
    CloudinaryProvider,
    CloudinaryService,
    LessonService,
    PrismaService,
    ImageService,
    VideoService,
  ],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
