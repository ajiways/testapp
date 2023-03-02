import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { UserEntity } from '../../modules/user/entities/user.entity';
import { RoleEntity } from '../../modules/role/entities/role.entity';
import { UserRoleEntity } from '../../modules/role/entities/user-role.entity';
import { rolesSeed1677768472739 } from '../../seeds/1677768472739-roles-seed';
import { userAndRolesEntities1677768000000 } from '../../migrations/1677768472739-user-and-roles-entities';
config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  // вообще не работает glob у typeorm, не знаю что делать (:
  entities: [UserEntity, RoleEntity, UserRoleEntity],
  migrations: [userAndRolesEntities1677768000000, rolesSeed1677768472739],
  migrationsTableName: 'migrations',
  schema: 'public',
  logging: false,
});
