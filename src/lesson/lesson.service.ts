import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MyLogger } from '../logger/my-logger.service';
import { ImageService } from '../media/image.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    private prisma: PrismaService,
    private imageService: ImageService,
    private cloudinaryService: CloudinaryService,
    private readonly logger: MyLogger,
  ) {}

  async create(
    moduleId: string,
    userId: number,
    dto: CreateLessonDto,
    image: Express.Multer.File,
  ) {
    try {
      // image
      let imageInCloudinary;

      // If the user sends both a link to an image and a file, we take only the link
      if (image && !dto.imageUrl) {
        try {
          imageInCloudinary = await this.imageService.upload(image, 'lesson');
        } catch (error) {
          this.logger.error({ method: 'lesson-create-cloudinary', error });
        }
      }

      return await this.prisma.lesson.create({
        data: {
          name: dto.name,
          description: dto.description,
          imageUrl: dto.imageUrl || imageInCloudinary?.url,
          ...(imageInCloudinary && {
            imagePublicId: imageInCloudinary?.public_id,
          }),
          videoUrl: dto.videoUrl,
          module: {
            connect: {
              id: moduleId,
              course: {
                userId,
                isActive: true,
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error({ method: 'lesson-create', error: error?.message });
      throw new InternalServerErrorException(
        'Failed to create lesson',
        error?.message,
      );
    }
  }

  async findAll(moduleId: string, userId: number) {
    // Check if the user is a seller of lessons
    const sellerLessons = await this.prisma.lesson.findMany({
      where: {
        module: {
          id: moduleId,
          course: {
            userId,
          },
        },
      },
    });

    if (sellerLessons.length) {
      return {
        role: 'SELLER',
        lessons: sellerLessons,
      };
    }

    // Check if the user is a customer
    const customerLessons = await this.prisma.lesson.findMany({
      where: {
        module: {
          id: moduleId,
          course: {
            purchases: {
              some: {
                customerId: userId,
              },
            },
          },
        },
      },
    });

    if (customerLessons.length) {
      return {
        role: 'CUSTOMER',
        lessons: customerLessons,
      };
    }

    // If the user is neither a buyer nor a seller, generate an exception
    throw new ForbiddenException(
      "You don't have access to lessons for this module",
    );
  }

  async findOne(id: string, userId: number) {
    const course = await this.prisma.course.findFirst({
      where: {
        isActive: true,
        modules: {
          some: {
            lessons: {
              some: {
                id,
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return await this.prisma.lesson.findFirst({
      where: {
        id,
        OR: [
          // seller
          {
            module: {
              course: {
                userId,
                isActive: true,
              },
            },
          },

          // customer
          {
            module: {
              course: {
                purchases: {
                  some: {
                    courseId: course.id,
                    customerId: userId,
                  },
                },
              },
            },
          },
        ],
      },
    });
  }

  async update(
    id: string,
    userId: number,
    dto: UpdateLessonDto,
    file: Express.Multer.File,
  ) {
    try {
      const lesson = await this.prisma.lesson.findFirst({
        where: {
          id,
          module: {
            course: {
              userId,
              isActive: true,
            },
          },
        },
      });

      if (!lesson) {
        throw new ForbiddenException(
          "You don't have access to this lesson or the course has been deleted",
        );
      }

      const { imageUrl, imagePublicId } = await this.imageService.getImageUrl(
        'lesson',
        lesson,
        dto,
        file,
      );

      return await this.prisma.lesson.update({
        where: {
          id,
          module: {
            course: {
              userId,
              isActive: true,
            },
          },
        },
        data: {
          imageUrl,
          imagePublicId,
          name: dto.name,
          description: dto.description,
          videoUrl: dto.videoUrl,
        },
      });
    } catch (error) {
      this.logger.error({ method: 'lesson-update', error: error?.message });
      throw new InternalServerErrorException(
        'Failed to update lesson',
        error?.message,
      );
    }
  }

  async delete(id: string, userId: number) {
    try {
      const lesson = await this.prisma.lesson.findFirst({
        where: {
          id,
          module: {
            course: {
              userId,
              isActive: true,
            },
          },
        },
      });

      if (!lesson) {
        throw new ForbiddenException(
          "You don't have access to this lesson or the course has been deleted",
        );
      }

      await this.imageService.deleteImageFromCloudinary(lesson);
      await this.deleteVideoFromCloudinary(id, userId);

      return await this.prisma.lesson.delete({
        where: {
          id,
          module: {
            course: {
              userId,
              isActive: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error({ method: 'lesson-delete', error: error?.message });
      throw new InternalServerErrorException(
        'Failed to delete lesson',
        error?.message,
      );
    }
  }

  async updateLessonVideo(
    lessonId: string,
    videoUrl: string,
    videoPublicId: string,
    userId: number,
  ) {
    return await this.prisma.lesson.update({
      where: {
        id: lessonId,
        module: {
          course: {
            userId,
            isActive: true,
          },
        },
      },
      data: {
        videoUrl,
        videoPublicId,
      },
    });
  }

  async uploadVideoAndUpdateLesson(
    video: Express.Multer.File,
    lessonId: string,
    userId: number,
  ) {
    try {
      const videoUploadResult = await this.cloudinaryService.uploadVideoFile(
        video,
        lessonId,
        userId,
      );

      // Check that the download has completed
      if (videoUploadResult.status === 'finished') {
        const { url, public_id } = videoUploadResult;

        // Remove the video from the cloudinary for replacement
        await this.deleteVideoFromCloudinary(lessonId, userId);

        // Update DB to new url and public_id
        await this.updateLessonVideo(lessonId, url, public_id, userId);
      } else {
        this.logger.log({
          method: 'uploadVideoAndUpdateLesson',
          log: 'Video is still processing',
        });
      }
    } catch (error) {
      this.logger.error({ method: 'uploadVideoAndUpdateLesson-upload', error });
    }
  }

  async deleteVideoFromCloudinary(lessonId: string, userId: number) {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id: lessonId,
        module: {
          course: {
            userId,
            isActive: true,
          },
        },
      },
    });

    if (lesson && lesson.videoUrl && lesson.videoPublicId) {
      try {
        this.logger.log({
          method: 'deleteVideoFromCloudinary',
          log: 'Start deleting a video file from Cloudinary',
        });
        await this.cloudinaryService.deleteVideoFile(lesson.videoPublicId);
      } catch (error) {
        this.logger.error({ method: 'deleteVideoFromCloudinary', error });
        throw new NotImplementedException(
          'Failed to delete a video from Cloudinary',
        );
      }
    }
  }
}
