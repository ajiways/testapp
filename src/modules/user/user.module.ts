import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user.service';

const services = [UserService];
const entities = [UserEntity];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services],
  exports: [...services],
})
export class UserModule {}
