import { Module } from '@nestjs/common';
import { ImageService } from '../image/image.service';
import { LessonService } from '../lesson/lesson.service';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
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
    SocketGateway,
  ],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
