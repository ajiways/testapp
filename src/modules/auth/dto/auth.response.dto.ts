import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EUserRole } from '../../../common/enums/user-role.enum';

export class AuthResponseDto {
  @ApiProperty({ default: 1, description: 'ID пользователя' })
  @Expose()
  userId: number;

  @ApiProperty({ default: 'Buddy', description: 'Логин пользователя' })
  @Expose()
  login: string;

  @ApiProperty({
    default: 'Успешная регистрация/авторизация!',
    description: 'Сообщение от сервера',
  })
  @Expose()
  message: string;

  @ApiProperty({ default: '%some_jwt_token%', description: 'JWT токен' })
  @Expose()
  token: string;

  @ApiProperty({
    default: [EUserRole.USER],
    description: 'Список ролей пользователя',
    isArray: true,
  })
  @Expose()
  roles: EUserRole[];
}
