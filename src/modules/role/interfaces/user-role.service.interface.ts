import { EntityManager } from 'typeorm';
import { EUserRole } from '../../../common/enums/user-role.enum';
import { UserEntity } from '../../user/entities/user.entity';
import { RoleEntity } from '../entities/role.entity';
import { UserRoleEntity } from '../entities/user-role.entity';

export interface IUserRoleService {
  attachRoleToUser(
    role: EUserRole,
    user: UserEntity,
    manager?: EntityManager | undefined,
  ): Promise<UserRoleEntity>;
  getUserRoles(
    user: UserEntity,
    manager?: EntityManager | undefined,
  ): Promise<RoleEntity[]>;
}
