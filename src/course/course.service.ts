import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CourseCreatedDto } from '../dto';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
    private readonly logger: MyLogger,
  ) {}

  async create(dto: CourseCreatedDto, image?: Express.Multer.File) {
    // Upload image
    let imageFromCloudinary;
    if (image) {
      try {
        imageFromCloudinary =
          await this.cloudinaryService.uploadCourseImage(image);
      } catch (error) {
        this.logger.error({ method: 'course-create-cloudinary', error });
      }
    }

    try {
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
          ...(image && {
            image: {
              create: {
                url: imageFromCloudinary?.url,
                publicId: imageFromCloudinary?.public_id,
              },
            },
          }),
        },
      });
    } catch (error) {
      this.logger.error({ method: 'course-create', error });
      throw new InternalServerErrorException(error?.message);
    }
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
