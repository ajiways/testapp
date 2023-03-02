import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import EnvConfig from './config/environment.config';
import { ConfigurationModule } from './config/configuration/configuration.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationService } from './config/configuration/configuration.service';
import TypeormConfig from './config/db/typeorm-config';
import { PingModule } from './modules/ping/ping.module';
import { AuthorizationModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';

const modules = [PingModule, UserModule, AuthorizationModule, RoleModule];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [EnvConfig, TypeormConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: async (config: ConfigurationService) => config.typeorm(),
      inject: [ConfigurationService],
    }),
    ConfigurationModule,
    ...modules,
  ],
})
export class AppModule {}
