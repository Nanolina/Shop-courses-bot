import { Injectable } from '@nestjs/common';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto, DeleteModuleDto, UpdateModuleDto } from './dto';

@Injectable()
export class ModuleService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
  ) {}

  async create(dto: CreateModuleDto) {
    try {
      return await this.prisma.module.create({
        data: {
          name: dto.name,
          description: dto.description,
          imageUrl: dto.imageUrl,
          course: {
            connect: {
              id: dto.courseId,
              user: {
                id: dto.userId,
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error({ method: 'module-create', error: error?.message });
      return null;
    }
  }

  async findAll(courseId: string) {
    return await this.prisma.module.findMany({
      where: {
        courseId,
      },
    });
  }

  async findOne(moduleId: string) {
    return await this.prisma.module.findFirst({
      where: {
        id: moduleId,
      },
    });
  }

  async update(dto: UpdateModuleDto) {
    try {
      return await this.prisma.module.update({
        where: {
          id: dto.moduleId,
          course: {
            user: {
              id: dto.userId,
            },
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
      return null;
    }
  }

  async delete(dto: DeleteModuleDto) {
    try {
      return await this.prisma.module.delete({
        where: {
          id: dto.moduleId,
          course: {
            user: {
              id: dto.userId,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error({ method: 'module-delete', error: error?.message });
      return null;
    }
  }
}
