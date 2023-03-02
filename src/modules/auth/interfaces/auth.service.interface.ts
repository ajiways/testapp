import { UserPreviewDto } from '../../user/dto/user-preview.dto';
import { RegisterDto } from '../dto/register/register.dto';
import { AuthResponseDto } from '../dto/auth.response.dto';
import { TTokenPayload } from '../strategies/jwt-strategy';
import { LoginDto } from '../dto/login/login.dto';

export interface IAuthorizationService {
  validateUser(payload: TTokenPayload): Promise<UserPreviewDto | null>;
  register(dto: RegisterDto): Promise<AuthResponseDto>;
  login(dto: LoginDto): Promise<AuthResponseDto>;
  whoAmI(user: UserPreviewDto): Promise<UserPreviewDto>;
}
