import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationModule } from '../../config/configuration/configuration.module';
import { ConfigurationService } from '../../config/configuration/configuration.service';
import { UserModule } from '../user/user.module';
import { AuthorizationController } from './controllers/auth.controller';
import { AuthorizationGuard } from './guards/auth.guard';
import { AuthorizationService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt-strategy';

const modules = [JwtModule, ConfigurationModule, UserModule];
const services = [AuthorizationService];
const controllers = [AuthorizationController];

@Module({
  imports: [
    ...modules,
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: (c: ConfigurationService) => c.jwtOptions(),
    }),
  ],
  controllers: [...controllers],
  providers: [...services, JwtStrategy, AuthorizationGuard],
})
export class AuthorizationModule {}
