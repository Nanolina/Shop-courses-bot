import { BadRequestException } from '@nestjs/common';

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

const videoFileFilter = (req, file, callback) => {
  if (!file.mimetype.match(/video\/(mp4|avi)$/)) {
    callback(
      new BadRequestException('Supported video formats are mp4 and avi'),
      false,
    );
    return;
  }
  callback(null, true);
};

export const videoUploadOptions = {
  fileFilter: videoFileFilter,
  limits: { fileSize: 500000000 }, // 500MB
};
