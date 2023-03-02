import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { UserRoleEntity } from './entities/user-role.entity';
import { RoleService } from './services/role.service';
import { UserRoleService } from './services/user-role.service';

const entities = [RoleEntity, UserRoleEntity];
const services = [RoleService, UserRoleService];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services],
  exports: [...services],
})
export class RoleModule {}
