import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ObjectLiteral } from 'typeorm';

export function ApiFile(
  fieldName = 'file',
  required = true,
  localOptions?: MulterOptions,
  schema?: ObjectLiteral,
) {
  const defaultFileSchema = {
    type: 'object',
    required: required ? [fieldName] : [],
    properties: {
      [fieldName]: {
        type: 'string',
        format: 'binary',
      },
    },
  };

  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, localOptions)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: schema ? schema : defaultFileSchema,
    }),
  );
}
