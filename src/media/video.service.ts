import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
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
        await this.cloudinaryService.deleteFile(lesson.imagePublicId);
      } catch (error) {
        this.logger.error({ method: 'deleteVideoFromCloudinary', error });
        throw new NotImplementedException(
          'Failed to delete a video from Cloudinary',
        );
      }
    }
  }

  async upload(file: Express.Multer.File, lesson?: Lesson) {
    if (!file) throw new BadRequestException('No video file provided');

    if (lesson) {
      await this.deleteVideoFromCloudinary(lesson);
    }

    return await this.cloudinaryService.uploadVideoFile(file);
  }

  async getVideoUrl(lesson: Lesson, dto: any, file: Express.Multer.File) {
    let videoInCloudinary;

    // If the user sends both a link to a video and a file, we take only the link
    if (file && !dto.videoUrl) {
      try {
        videoInCloudinary = await this.upload(file, lesson);
      } catch (error) {
        this.logger.error({
          method: 'getVideoUrl',
          error,
        });
      }
    }

    let videoUrl;
    let videoPublicId;
    // Delete the video completely
    console.log('dto.isRemoveVideo', dto.isRemoveVideo);
    console.log('Boolean(dto.isRemoveVideo)', Boolean(dto.isRemoveVideo));
    if (Boolean(dto.isRemoveVideo)) {
      videoUrl = null;
      videoPublicId = null;
      // Change to an image from Cloudinary
    } else if (videoInCloudinary?.url && videoInCloudinary?.public_id) {
      videoUrl = videoInCloudinary?.url;
      videoPublicId = videoInCloudinary?.public_id;
      // Change to the image from the incoming link from the user
    } else if (dto.videoUrl) {
      videoUrl = dto.videoUrl;
      videoPublicId = null;
      // Leave it as it was
    } else {
      videoUrl = lesson.videoUrl;
      videoPublicId = lesson.videoPublicId;
    }

    return {
      videoUrl,
      videoPublicId,
    };
  }
}
