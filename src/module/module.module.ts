import { Module } from '@nestjs/common';
import { ImageModule } from '../image/image.module';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';

@Module({
  imports: [LoggerModule, ImageModule],
  controllers: [ModuleController],
  providers: [ModuleService, PrismaService],
})
export class ModuleModule {}
