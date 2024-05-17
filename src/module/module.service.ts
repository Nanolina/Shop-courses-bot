import { Injectable } from '@nestjs/common';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto, UpdateModuleDto } from './dto';

@Injectable()
export class ModuleService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
  ) {}

  async create(courseId: string, dto: CreateModuleDto) {
    try {
      return await this.prisma.module.create({
        data: {
          courseId,
          name: dto.name,
          description: dto.description,
        },
      });
    } catch (error) {
      this.logger.error({ method: 'module-create', error });
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

  async update(moduleId: string, dto: UpdateModuleDto) {
    try {
      return await this.prisma.module.update({
        where: {
          id: moduleId,
        },
        data: {
          name: dto.name,
          description: dto.description,
        },
      });
    } catch (error) {
      this.logger.error({ method: 'module-update', error });
      return null;
    }
  }

  async remove(moduleId: string) {
    try {
      return await this.prisma.module.delete({
        where: {
          id: moduleId,
        },
      });
    } catch (error) {
      this.logger.error({ method: 'module-remove', error });
      return null;
    }
  }
}
