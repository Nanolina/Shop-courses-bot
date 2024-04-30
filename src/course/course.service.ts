import { Injectable } from '@nestjs/common';
import { CourseCreatedDto } from '../dto';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
  ) {}

  async create(dto: CourseCreatedDto) {
    return await this.prisma.course.create({
      data: {
        name: dto.name,
        description: dto.description,
        category: dto.category,
        subcategory: dto.subcategory,
        price: dto.price,
        currency: dto.currency,
        user: {
          connectOrCreate: {
            where: {
              id: dto.userId,
            },
            create: {
              id: dto.userId,
              name: dto.userName,
            },
          },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.course.findMany({
      include: {
        image: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.course.findFirst({
      where: {
        id,
      },
      include: {
        image: true,
      },
    });
  }
}
