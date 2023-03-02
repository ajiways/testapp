import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthResponseDto {
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
}
