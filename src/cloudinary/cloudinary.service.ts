import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as streamifier from 'streamifier';
import { EntityType } from 'types';

@Injectable()
export class CloudinaryService {
  uploadImageFile(
    file: Express.Multer.File,
    folder: EntityType,
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    return new Promise<UploadApiErrorResponse | UploadApiResponse>(
      (resolve, reject) => {
        const upload = v2.uploader.upload_stream(
          {
            folder,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        streamifier.createReadStream(file.buffer).pipe(upload);
      },
    );
  }

  deleteImageFile(
    publicId: string,
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(publicId, { invalidate: true }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  uploadVideoFile(
    file: Express.Multer.File,
    lessonId: string,
    userId: number,
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    return new Promise<UploadApiErrorResponse | UploadApiResponse>(
      (resolve, reject) => {
        const uploadStream = v2.uploader.upload_stream(
          {
            resource_type: 'video',
            folder: 'lesson',
            context: { lessonId, userId },
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      },
    );
  }

  deleteVideoFile(
    publicId: string,
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(
        publicId,
        { invalidate: true, resource_type: 'video' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
    });
  }
}
