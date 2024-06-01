import { Injectable, NotImplementedException } from '@nestjs/common';
import { Lesson } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MyLogger } from '../logger/my-logger.service';

@Injectable()
export class VideoService {
  constructor(
    private cloudinaryService: CloudinaryService,
    private readonly logger: MyLogger,
  ) {}

  async deleteVideoFromCloudinary(lesson: Lesson) {
    if (lesson.videoUrl && lesson.videoPublicId) {
      try {
        await this.cloudinaryService.deleteFile(lesson.videoPublicId);
      } catch (error) {
        this.logger.error({ method: 'deleteVideoFromCloudinary', error });
        throw new NotImplementedException(
          'Failed to delete a video from Cloudinary',
        );
      }
    }
  }
}
