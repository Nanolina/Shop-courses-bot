import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { Course, Lesson, Module } from '@prisma/client';
import { EntityType } from 'types';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MyLogger } from '../logger/my-logger.service';

@Injectable()
export class ImageService {
  constructor(
    private cloudinaryService: CloudinaryService,
    private readonly logger: MyLogger,
  ) {}

  async deleteImageFromCloudinary(typeFromDB: Course | Module | Lesson) {
    if (typeFromDB.imageUrl && typeFromDB.imagePublicId) {
      try {
        await this.cloudinaryService.deleteImageFile(typeFromDB.imagePublicId);
      } catch (error) {
        this.logger.error({ method: 'deleteImageFromCloudinary', error });
        throw new NotImplementedException(
          'Failed to delete an image from Cloudinary',
        );
      }
    }
  }

  async upload(
    file: Express.Multer.File,
    type: EntityType,
    typeFromDB?: Course | Module | Lesson,
  ) {
    if (!file) throw new BadRequestException('No image file provided');

    if (typeFromDB) {
      await this.deleteImageFromCloudinary(typeFromDB);
    }

    return await this.cloudinaryService.uploadImageFile(file, type);
  }

  async getImageUrl(
    type: EntityType,
    typeFromDB: Course | Module | Lesson,
    dto: any,
    file: Express.Multer.File,
  ) {
    let imageInCloudinary;

    // If the user sends both a link to an image and a file, we take only the link
    if (file && !dto.imageUrl) {
      try {
        imageInCloudinary = await this.upload(file, type, typeFromDB);
      } catch (error) {
        this.logger.error({
          method: `getImageUrl-${type}-${typeFromDB.id}`,
          error,
        });
      }
    }

    let imageUrl;
    let imagePublicId;
    // Delete the image completely
    if (Boolean(dto.isRemoveImage)) {
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
      imageUrl = typeFromDB.imageUrl;
      imagePublicId = typeFromDB.imagePublicId;
    }

    return {
      imageUrl,
      imagePublicId,
    };
  }
}
