import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EUserRole } from '../../../common/enums/user-role.enum';

export class UserPreviewDto {
  @ApiProperty({ default: 1, description: 'ID пользователя' })
  @Expose()
  userId: number;

  @ApiProperty({ default: 'Buddy', description: 'Логин пользователя' })
  @Expose()
  login: string;

  @ApiProperty({
    default: [EUserRole.USER],
    description: 'Список ролей пользователя',
    isArray: true,
  })
  @Expose()
  roles: EUserRole[];
}
