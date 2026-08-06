import { memoryStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';

export const imageMulterConfig = {
  storage: memoryStorage(),
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      return callback(
        new BadRequestException('Only JPG, JPEG, PNG, and WEBP image formats are allowed'),
        false,
      );
    }
    callback(null, true);  
  },
  limits: { fileSize: 2 * 1024 * 1024 },
};
