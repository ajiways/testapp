import { Request } from 'express';
import { diskStorage } from 'multer';
import { generateFileName, generateFilePath } from '../helpers/file';

export const imagesStorage = diskStorage({
  destination: (_: Request, __: Express.Multer.File, callback) => {
    callback(null, generateFilePath());
  },
  filename: generateFileName,
});
