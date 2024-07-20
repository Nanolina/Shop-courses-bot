import { Module, forwardRef } from '@nestjs/common';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ImageService } from '../image/image.service';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramModule } from '../telegram-bot/telegram.module';
import { UserModule } from '../user/user.module';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';

@Module({
  imports: [
    LoggerModule,
    UserModule,
    TelegramModule,
    forwardRef(() => CloudinaryModule),
  ],
  controllers: [LessonController],
  providers: [LessonService, PrismaService, ImageService],
  exports: [LessonService],
})
export class LessonModule {}
