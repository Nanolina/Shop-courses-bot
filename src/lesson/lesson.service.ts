import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MyLogger } from '../logger/my-logger.service';
import { ImageService } from '../media/image.service';
import { PrismaService } from '../prisma/prisma.service';
import { VideoService } from './../media/video.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    private prisma: PrismaService,
    private imageService: ImageService,
    private videoService: VideoService,
    private readonly logger: MyLogger,
  ) {}

  async create(
    moduleId: string,
    userId: number,
    dto: CreateLessonDto,
    image: Express.Multer.File,
    video: Express.Multer.File,
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

      // video
      let videoInCloudinary;

      // If the user sends both a link to a video and a file, we take only the link
      if (video && !dto.videoUrl) {
        try {
          videoInCloudinary = await this.videoService.upload(video);
        } catch (error) {
          this.logger.error({
            method: 'lesson-create-cloudinary-video',
            error,
          });
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
          videoUrl: dto.videoUrl || videoInCloudinary?.url,
          ...(videoInCloudinary && {
            videoPublicId: videoInCloudinary?.public_id,
          }),
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
    const course = await this.prisma.course.findFirst({
      where: {
        isActive: true,
        modules: {
          some: {
            id: moduleId,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return await this.prisma.lesson.findMany({
      where: {
        moduleId,
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
            },
          },
        },
      });
      await this.imageService.deleteImageFromCloudinary(lesson);

      return await this.prisma.lesson.delete({
        where: {
          id,
          module: {
            course: {
              userId,
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
}
