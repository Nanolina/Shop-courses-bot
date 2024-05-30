import { Injectable } from '@nestjs/common';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { DeleteLessonDto } from './dto';
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
                  id: dto.userId,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error({ method: 'lesson-create', error: error?.message });
      return null;
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
                id: dto.userId,
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
      this.logger.error({ method: 'lesson-update', error: error?.message });
      return null;
    }
  }

  async delete(dto: DeleteLessonDto) {
    try {
      return await this.prisma.lesson.delete({
        where: {
          id: dto.lessonId,
          module: {
            course: {
              user: {
                id: dto.userId,
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error({ method: 'lesson-delete', error: error?.message });
      return null;
    }
  }
}
