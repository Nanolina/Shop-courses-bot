import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';

@Module({
  imports: [LoggerModule],
  controllers: [ModuleController],
  providers: [ModuleService, PrismaService],
})
export class ModuleModule {}
