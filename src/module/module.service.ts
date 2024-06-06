import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CUSTOMER, SELLER } from '../consts';
import { ImageService } from '../image/image.service';
import { MyLogger } from '../logger/my-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto, UpdateModuleDto } from './dto';

@Injectable()
export class ModuleService {
  constructor(
    private prisma: PrismaService,
    private imageService: ImageService,
    private readonly logger: MyLogger,
  ) {}

  async create(
    courseId: string,
    userId: number,
    dto: CreateModuleDto,
    image: Express.Multer.File,
  ) {
    try {
      let imageInCloudinary;

      // If the user sends both a link to an image and a file, we take only the link
      if (image && !dto.imageUrl) {
        try {
          imageInCloudinary = await this.imageService.upload(image, 'module');
        } catch (error) {
          this.logger.error({ method: 'module-create-cloudinary', error });
        }
      }

      return await this.prisma.module.create({
        data: {
          name: dto.name,
          description: dto.description,
          imageUrl: dto.imageUrl || imageInCloudinary?.url,
          ...(imageInCloudinary && {
            imagePublicId: imageInCloudinary?.public_id,
          }),
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
    // Check if the user is a seller of modules
    const sellerModules = await this.prisma.module.findMany({
      where: {
        course: {
          id: courseId,
          userId,
        },
      },
    });

    if (sellerModules.length) {
      return {
        role: SELLER,
        modules: sellerModules,
      };
    }

    // Check if the user is a customer
    const customerModules = await this.prisma.module.findMany({
      where: {
        course: {
          purchases: {
            some: {
              courseId,
              customerId: userId,
            },
          },
        },
      },
    });

    if (customerModules.length) {
      return {
        role: CUSTOMER,
        modules: customerModules,
      };
    }

    // If the user is neither a buyer nor a seller, generate an exception
    throw new ForbiddenException(
      "Modules not found or you don't have access to modules for this course",
    );
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

  async update(
    id: string,
    userId: number,
    dto: UpdateModuleDto,
    file: Express.Multer.File,
  ) {
    try {
      const module = await this.prisma.module.findFirst({
        where: {
          id,
          course: {
            userId,
            isActive: true,
          },
        },
      });

      if (!module) {
        throw new ForbiddenException(
          "You don't have access to this module or the course has been deleted",
        );
      }

      const { imageUrl, imagePublicId } = await this.imageService.getImageUrl(
        'module',
        module,
        dto,
        file,
      );

      return await this.prisma.module.update({
        where: {
          id,
          course: {
            userId,
            isActive: true,
          },
        },
        data: {
          imageUrl,
          imagePublicId,
          name: dto.name,
          description: dto.description,
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
      const module = await this.prisma.module.findFirst({
        where: {
          id,
          course: {
            userId,
            isActive: true,
          },
        },
      });

      if (!module) {
        throw new ForbiddenException(
          "You don't have access to this module or the course has been deleted",
        );
      }

      await this.imageService.deleteImageFromCloudinary(module);

      await this.prisma.module.delete({
        where: {
          id,
          course: {
            userId,
            isActive: true,
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
