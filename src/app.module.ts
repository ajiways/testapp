import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import EnvConfig from './config/environment.config';
import { ConfigurationModule } from './config/configuration/configuration.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationService } from './config/configuration/configuration.service';
import TypeormConfig from './config/db/typeorm-config';
import { PingModule } from './modules/ping/ping.module';

const modules = [PingModule];

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
