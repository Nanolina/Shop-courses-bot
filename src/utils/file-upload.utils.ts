import { BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

const imageFileFilter = (req, file, callback) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    callback(
      new BadRequestException('The image format should be either jpeg or png'),
      false,
    );
    return;
  }
  callback(null, true);
};

export const imageUploadOptions = {
  fileFilter: imageFileFilter,
  limits: { fileSize: 512000 }, // 500KB
};

const filesUploadOptions = {
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith('image/') && file.size > 512000) {
      // 500 KB limit for images
      callback(new BadRequestException('Image file is too large'), false);
    } else if (file.mimetype.startsWith('video/') && file.size > 500000000) {
      // 500 MB limit for videos
      callback(new BadRequestException('Video file is too large'), false);
    } else {
      callback(null, true);
    }
  },
};

export function multimediaInterceptor() {
  return FilesInterceptor('files', 2, filesUploadOptions);
}
