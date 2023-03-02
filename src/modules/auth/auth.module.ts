import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationModule } from '../../config/configuration/configuration.module';
import { ConfigurationService } from '../../config/configuration/configuration.service';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { AuthorizationController } from './controllers/auth.controller';
import { AuthorizationGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthorizationService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt-strategy';

const modules = [JwtModule, ConfigurationModule, UserModule, RoleModule];
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
  providers: [...services, JwtStrategy, AuthorizationGuard, RolesGuard],
})
export class AuthorizationModule {}
