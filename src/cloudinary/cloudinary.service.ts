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
            transformation: [
              { width: 1280, height: 720, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' },
            ],
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
      v2.uploader.destroy(
        publicId,
        { invalidate: true, resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
    });
  }

  async uploadVideoFromUrl(
    fileUrl: string,
    lessonId: string,
    userId: number,
    chatId: number,
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    console.log('CLOUDINARY');
    return new Promise((resolve, reject) => {
      v2.uploader.upload_large(
        fileUrl,
        {
          resource_type: 'video',
          folder: 'lesson',
          context: {
            lessonId,
            userId,
            chatId,
          },
          chunk_size: 20 * 1024 * 1024, // 20 MB
        },
        (error, result) => {
          if (error) {
            console.error('Upload error:', error);
            return reject(error);
          }
          console.log('Upload result:', result);
          resolve(result);
        },
      );
    });
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
