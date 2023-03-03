import { Expose } from 'class-transformer';

export class UserPreviewDto {
  @Expose()
  userId: number;

  @Expose()
  login: string;
}
