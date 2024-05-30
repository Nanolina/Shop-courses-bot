import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto, UpdateModuleDto } from './dto';

@Injectable()
export class ModuleService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
  ) {}

  async create(courseId: string, userId: number, dto: CreateModuleDto) {
    try {
      return await this.prisma.module.create({
        data: {
          name: dto.name,
          description: dto.description,
          imageUrl: dto.imageUrl,
          course: {
            connect: {
              id: courseId,
              userId,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error({ method: 'module-create', error: error?.message });
      throw new InternalServerErrorException(
        'Failed to create module',
        error?.message,
      );
    }
  }

  async findAll(courseId: string, userId: number) {
    return await this.prisma.module.findMany({
      where: {
        OR: [
          // seller
          {
            course: {
              id: courseId,
              userId,
            },
          },

          // customer
          {
            course: {
              purchases: {
                some: {
                  courseId,
                  customerId: userId,
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
        modules: {
          some: {
            id,
          },
        },
        isActive: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return await this.prisma.module.findFirst({
      where: {
        id,
        OR: [
          // seller
          {
            course: {
              id: course.id,
              userId,
            },
          },

          // customer
          {
            course: {
              purchases: {
                some: {
                  courseId: course.id,
                  customerId: userId,
                },
              },
            },
          },
        ],
      },
    });
  }

  async update(id: string, userId: number, dto: UpdateModuleDto) {
    try {
      return await this.prisma.module.update({
        where: {
          id,
          course: {
            userId,
          },
        },
        data: {
          name: dto.name,
          description: dto.description,
          imageUrl: dto.imageUrl,
        },
      });
    } catch (error) {
      this.logger.error({ method: 'module-update', error: error?.message });
      throw new InternalServerErrorException(
        'Failed to update module',
        error?.message,
      );
    }
  }

  async delete(id: string, userId: number) {
    try {
      return await this.prisma.module.delete({
        where: {
          id,
          course: {
            userId,
          },
        },
      });
    } catch (error) {
      this.logger.error({ method: 'module-delete', error: error?.message });
      throw new InternalServerErrorException(
        'Failed to delete module',
        error?.message,
      );
    }
  }
}
