import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UpdateImageResponseDto {
  @ApiProperty({ default: 1, description: 'ID изображения' })
  @Expose()
  id: number;

  @ApiProperty({
    default: '/uploads/12/13/14/15/img.jpeg',
    description: 'Новый путь к изображению',
  })
  @Expose()
  newFilePath: string;
}
