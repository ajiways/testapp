import { PickType } from '@nestjs/swagger';
import { RegisterDto } from '../register/register.dto';

export class LoginDto extends PickType(RegisterDto, ['login', 'password']) {}
