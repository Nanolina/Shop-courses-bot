import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
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

  async uploadVideoFile(
    file: Express.Multer.File,
    lessonId: string,
    userId: number,
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    const tempDir = path.join(__dirname, '..', 'temp');
    const tempFilePath = path.join(tempDir, file.originalname);

    // Ensure the temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    try {
      // Save the file temporarily on the server
      await fs.promises.writeFile(tempFilePath, file.buffer);

      // Upload the file to Cloudinary
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        v2.uploader.upload_large(
          tempFilePath,
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
      });

      return result;
    } catch (error) {
      console.error('Error during upload:', error);
      throw error;
    } finally {
      // Check if the file exists before deleting
      try {
        await fs.promises.access(tempFilePath);
        await fs.promises.unlink(tempFilePath);
        console.log('Temporary file deleted');
      } catch (error) {
        console.error(`Failed to delete temp file: ${tempFilePath}`, error);
      }
    }
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
