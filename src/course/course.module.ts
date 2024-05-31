import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ImageService } from '../image/image.service';
import { LoggerModule } from '../logger/logger.module';
import { PrismaService } from '../prisma/prisma.service';
import { CourseController } from './course.controller';
import {
  CourseAllUsersService,
  CourseCustomerService,
  CourseSellerService,
} from './services';

@Module({
  imports: [LoggerModule, CloudinaryModule],
  controllers: [CourseController],
  providers: [
    CourseAllUsersService,
    CourseCustomerService,
    CourseSellerService,
    PrismaService,
    ImageService,
  ],
})
export class CourseModule {}
