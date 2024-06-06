import { Module } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ImageService } from '../image/image.service';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';

@Module({
  imports: [LoggerModule],
  controllers: [ModuleController],
  providers: [ModuleService, PrismaService, ImageService, CloudinaryService],
})
export class ModuleModule {}
