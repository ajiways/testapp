import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DeleteAllImagesResponseDto {
  @ApiProperty({ description: 'Количество удаленных изображений', default: 15 })
  @Expose()
  count: number;
}
