import { Module } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
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
  imports: [LoggerModule],
  controllers: [CourseController],
  providers: [
    CourseAllUsersService,
    CourseCustomerService,
    CourseSellerService,
    PrismaService,
    ImageService,
    CloudinaryService,
  ],
})
export class CourseModule {}
