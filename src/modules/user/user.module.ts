import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from '../role/role.module';
import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user.service';

const modules = [RoleModule];
const services = [UserService];
const entities = [UserEntity];

@Module({
  imports: [TypeOrmModule.forFeature(entities), ...modules],
  providers: [...services],
  exports: [...services],
})
export class UserModule {}
