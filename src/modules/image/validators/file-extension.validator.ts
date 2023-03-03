import { HttpException, HttpStatus } from '@nestjs/common';
import * as mime from 'mime';
import { Request } from 'express';

export function fileExtensionFilter(...mimetypes: string[]) {
  return (
    _: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (mimetypes.includes(mime.getExtension(file.mimetype)!)) {
      callback(null, true);
    } else {
      callback(
        new HttpException(
          `Файл не соответствует типу: ${mimetypes.join(', ')}`,
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        ),
        false,
      );
    }
  };
}
