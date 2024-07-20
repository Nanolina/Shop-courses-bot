import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { LoggerModule } from '../logger/logger.module';
import { ImageService } from './image.service';

@Module({
  imports: [CloudinaryModule, LoggerModule],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
