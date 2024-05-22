import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SOMETHING_WRONG_ERROR } from '../consts';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
  ) {}

  async create(dto: CreateLessonDto) {
    try {
      return await this.prisma.lesson.create({
        data: {
          name: dto.name,
          description: dto.description,
          imageUrl: dto.imageUrl,
          videoUrl: dto.videoUrl,
          module: {
            connect: {
              id: dto.moduleId,
              course: {
                user: {
                  tgId: dto.userId,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error({ method: 'lesson-create', error });
      throw new InternalServerErrorException(
        SOMETHING_WRONG_ERROR,
        error?.message,
      );
    }
  }

  async findAll(moduleId: string) {
    return await this.prisma.lesson.findMany({
      where: {
        moduleId,
      },
    });
  }

  async findOne(lessonId: string) {
    return await this.prisma.lesson.findFirst({
      where: {
        id: lessonId,
      },
    });
  }

  async update(dto: UpdateLessonDto) {
    try {
      return await this.prisma.lesson.update({
        where: {
          id: dto.lessonId,
          module: {
            course: {
              user: {
                tgId: dto.userId,
              },
            },
          },
        },
        data: {
          name: dto.name,
          description: dto.description,
          imageUrl: dto.imageUrl,
          videoUrl: dto.videoUrl,
        },
      });
    } catch (error) {
      this.logger.error({ method: 'lesson-update', error });
      throw new InternalServerErrorException(
        SOMETHING_WRONG_ERROR,
        error?.message,
      );
    }
  }

  async remove(lessonId: string, userId: number) {
    try {
      return await this.prisma.lesson.delete({
        where: {
          id: lessonId,
          module: {
            course: {
              user: {
                tgId: userId,
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error({ method: 'lesson-remove', error });
      throw new InternalServerErrorException(
        SOMETHING_WRONG_ERROR,
        error?.message,
      );
    }
  }
}
