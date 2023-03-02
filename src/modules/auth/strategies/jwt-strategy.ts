import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigurationService } from '../../../config/configuration/configuration.service';
import { UserPreviewDto } from '../../user/dto/user-preview.dto';
import { AuthorizationService } from '../services/auth.service';

export type TTokenPayload = { login: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject()
  private readonly authService: AuthorizationService;

  constructor(configurationService: ConfigurationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configurationService.env.JWT_SECRET,
    });
  }

  async validate(payload: TTokenPayload): Promise<UserPreviewDto> {
    const user = await this.authService.validateUser(payload);

    if (!user) {
      throw new ForbiddenException('Токен истёк или отсутствует');
    }

    return user;
  }
}
