import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SOMETHING_WRONG_ERROR } from '../consts';
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
          imageUrl: dto.imageUrl,
          course: {
            connect: {
              id: dto.courseId,
              user: {
                tgId: dto.userId,
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error({ method: 'module-create', error });
      throw new InternalServerErrorException(
        SOMETHING_WRONG_ERROR,
        error?.message,
      );
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
              tgId: dto.userId,
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
      this.logger.error({ method: 'module-update', error });
      throw new InternalServerErrorException(
        SOMETHING_WRONG_ERROR,
        error?.message,
      );
    }
  }

  async remove(moduleId: string, userId: number) {
    try {
      return await this.prisma.module.delete({
        where: {
          id: moduleId,
          course: {
            user: {
              tgId: userId,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error({ method: 'module-remove', error });
      throw new InternalServerErrorException(
        SOMETHING_WRONG_ERROR,
        error?.message,
      );
    }
  }
}
