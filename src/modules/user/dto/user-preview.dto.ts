import { Expose } from 'class-transformer';

export class UserPreviewDto {
  @Expose()
  login: string;
}
