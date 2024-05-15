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

  async create(dto: CreateModuleDto) {
    try {
      return await this.prisma.module.create({
        data: {
          name: dto.name,
          description: dto.description,
          courseId: dto.courseId,
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

  async findOne(id: string) {
    return await this.prisma.course.findFirst({
      where: {
        id,
      },
    });
  }

  async update(id: string, dto: UpdateModuleDto) {
    try {
      return await this.prisma.module.update({
        where: {
          id,
        },
        data: {
          name: dto.name,
          description: dto.description,
        },
      });
    } catch (error) {
      this.logger.error({ method: 'module-create', error });
      return null;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.module.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      this.logger.error({ method: 'module-remove', error });
      return null;
    }
  }
}
