import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';

@Injectable()
export class CloudinaryService{
  
  uploadImage(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<UploadApiResponse> {
    if (!file) {
      throw new BadRequestException('No file provided for upload.');
    }
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: `restaurant/${fileName}` },
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error)
            return reject(
              new BadRequestException(`File upload failed: ${error.message}`),
            );
          if (!result)
            return reject(
              new BadRequestException(
                'No response received from cloud storage provider.',
              ),
            );
          resolve(result);
        },
      );
      upload.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId).catch(() => undefined);
  }
}
