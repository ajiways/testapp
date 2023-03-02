import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    maxLength: 8,
    minLength: 4,
    default: 'Buddy',
    description: 'Логин пользователя',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  login: string;

  @ApiProperty({
    minLength: 8,
    default: 'qi@2Ejszn',
    description: 'Пароль пользователя',
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
