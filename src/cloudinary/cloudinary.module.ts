import { Module } from '@nestjs/common';
import { LessonModule } from '../lesson/lesson.module';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { SocketModule } from '../socket/socket.module';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [LoggerModule, LessonModule, SocketModule],
  controllers: [CloudinaryController],
  providers: [CloudinaryProvider, CloudinaryService, PrismaService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
