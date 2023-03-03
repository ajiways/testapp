import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserPreviewDto } from '../../user/dto/user-preview.dto';
import { IUserService } from '../../user/interfaces/user-serivce.interface';
import { UserService } from '../../user/services/user.service';
import { RegisterDto } from '../dto/register/register.dto';
import { AuthResponseDto } from '../dto/auth.response.dto';
import { IAuthorizationService } from '../interfaces/auth.service.interface';
import { LoginDto } from '../dto/login/login.dto';
import { ConfigurationService } from '../../../config/configuration/configuration.service';
import { TTokenPayload } from '../types/token-payload.type';

@Injectable()
export class AuthorizationService implements IAuthorizationService {
  @Inject()
  private readonly configService: ConfigurationService;

  @Inject(UserService)
  private readonly userService: IUserService;

  @Inject()
  private readonly jwtService: JwtService;

  private async createJWTToken(payload: TTokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.env.JWT_SECRET,
      expiresIn: this.configService.env.JWT_EXPIRES_IN,
    });
  }

  public async validateUser(
    payload: TTokenPayload,
  ): Promise<UserPreviewDto | null> {
    const user = await this.userService.findById(payload.userId);

    let userPreview: UserPreviewDto | null = null;

    if (user) {
      userPreview = plainToInstance(
        UserPreviewDto,
        { login: user.login, userId: user.id },
        {
          excludeExtraneousValues: true,
        },
      );
    }

    return userPreview;
  }

  public async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const candidate = await this.userService.findUser(dto.login);

    if (candidate) {
      throw new BadRequestException('Ошибка регистрации');
    }

    const hashedPassword = await hash(dto.password, 6);

    const newUser = await this.userService.createUser(
      dto.login,
      hashedPassword,
    );

    const token = await this.createJWTToken({
      login: newUser.login,
      userId: newUser.userId,
    });

    return plainToInstance(AuthResponseDto, {
      id: newUser.userId,
      login: newUser.login,
      message: 'Успешная регистрация!',
      token,
    });
  }

  public async login(dto: LoginDto): Promise<AuthResponseDto> {
    const candidate = await this.userService.findUser(dto.login);

    if (!candidate) {
      throw new BadRequestException('Ошибка авторизации');
    }

    const isRightPassword = await compare(dto.password, candidate.password);

    if (!isRightPassword) {
      throw new BadRequestException('Ошибка авторизации');
    }

    const token = await this.createJWTToken({
      login: dto.login,
      userId: candidate.id,
    });

    return plainToInstance(AuthResponseDto, {
      id: candidate.id,
      login: candidate.login,
      message: 'Успешная авторизация!',
      token,
    });
  }

  public async whoAmI(user: UserPreviewDto): Promise<UserPreviewDto> {
    return user;
  }
}
