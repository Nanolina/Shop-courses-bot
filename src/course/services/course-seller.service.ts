import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ImageService } from '../../image/image.service';
import { MyLogger } from '../../logger/my-logger.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from '../dto';

@Injectable()
export class CourseSellerService {
  constructor(
    private prisma: PrismaService,
    private imageService: ImageService,
    private readonly logger: MyLogger,
  ) {}

  async create(
    userId: number,
    dto: CreateCourseDto,
    image: Express.Multer.File,
  ) {
    console.log('typeof dto.price', typeof dto.price);
    try {
      let imageInCloudinary;

      // If the user sends both a link to an image and a file, we take only the link
      if (image && !dto.imageUrl) {
        try {
          imageInCloudinary = await this.imageService.upload(image);
        } catch (error) {
          this.logger.error({ method: 'course-create-cloudinary', error });
        }
      }

      return await this.prisma.course.create({
        data: {
          name: dto.name,
          description: dto.description,
          category: dto.category,
          subcategory: dto.subcategory,
          price: dto.price,
          currency: dto.currency,
          walletAddressSeller: dto.walletAddressSeller,
          imageUrl: dto.imageUrl || imageInCloudinary?.url,
          ...(imageInCloudinary && {
            imagePublicId: imageInCloudinary?.public_id,
          }),
          user: {
            connectOrCreate: {
              where: {
                id: userId,
              },
              create: {
                id: userId,
              },
            },
          },
        },
      });
    } catch (error) {
      this.logger.error({ method: 'course-create', error: error?.message });
      throw new InternalServerErrorException(
        'Failed to create course',
        error?.message,
      );
    }
  }

  async findAllCreatedCourses(userId: number) {
    return await this.prisma.course.findMany({
      where: {
        userId,
        isActive: true,
      },
    });
  }

  async findOneCreatedCourse(id: string, userId: number) {
    return await this.prisma.course.findFirst({
      where: {
        id,
        userId,
        isActive: true,
      },
    });
  }

  async update(
    id: string,
    userId: number,
    dto: UpdateCourseDto,
    image: Express.Multer.File,
  ) {
    console.log('typeof dto.isRemoveImage', typeof dto.isRemoveImage);
    try {
      const course = await this.prisma.course.findFirst({
        where: {
          id,
          userId,
          isActive: true,
        },
      });

      const { imageUrl, imagePublicId } = await this.getImage(
        course,
        dto,
        userId,
        image,
      );

      return await this.prisma.course.update({
        where: {
          id,
          userId,
          isActive: true,
        },
        data: {
          imageUrl,
          imagePublicId,
          name: dto.name,
          description: dto.description,
          category: dto.category,
          subcategory: dto.subcategory,
          price: dto.price,
          currency: dto.currency,
          walletAddressSeller: dto.walletAddressSeller,
        },
      });
    } catch (error) {
      this.logger.error({ method: 'course-update', error: error?.message });
      throw new InternalServerErrorException(
        'Failed to update course',
        error?.message,
      );
    }
  }

  async delete(id: string, userId: number) {
    try {
      // Course
      await this.prisma.course.update({
        where: {
          id,
          userId,
        },
        data: {
          isActive: false,
        },
      });

      // Modules
      await this.prisma.module.deleteMany({
        where: {
          course: {
            id,
            userId,
          },
        },
      });

      // Lessons
      await this.prisma.lesson.deleteMany({
        where: {
          module: {
            course: {
              id,
              userId,
            },
          },
        },
      });

      return true;
    } catch (error) {
      this.logger.error({ method: 'course-delete', error: error?.message });
      throw new InternalServerErrorException(
        'Failed to delete course',
        error?.message,
      );
    }
  }

  private async getImage(course, dto, userId, image) {
    let imageInCloudinary;

    // If the user sends both a link to an image and a file, we take only the link
    if (image && !dto.imageUrl) {
      try {
        imageInCloudinary = await this.imageService.upload(
          image,
          course.id,
          userId,
        );
      } catch (error) {
        this.logger.error({ method: 'course-update-cloudinary', error });
      }
    }

    let imageUrl;
    let imagePublicId;
    // Delete the image completely
    if (dto.isRemoveImage) {
      imageUrl = null;
      imagePublicId = null;
      // Change to an image from Cloudinary
    } else if (imageInCloudinary?.url && imageInCloudinary?.public_id) {
      imageUrl = imageInCloudinary?.url;
      imagePublicId = imageInCloudinary?.public_id;
      // Change to the image from the incoming link from the user
    } else if (dto.imageUrl) {
      imageUrl = dto.imageUrl;
      imagePublicId = null;
      // Leave it as it was
    } else {
      imageUrl = course.imageUrl;
      imagePublicId = course.imagePublicId;
    }

    return {
      imageUrl,
      imagePublicId,
    };
  }
}
