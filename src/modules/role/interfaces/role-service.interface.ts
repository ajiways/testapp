import { EntityManager } from 'typeorm';
import { EUserRole } from '../../../common/enums/user-role.enum';
import { RoleEntity } from '../entities/role.entity';

export interface IRoleService {
  getRoleByName(
    name: EUserRole,
    manager?: EntityManager | undefined,
  ): Promise<RoleEntity>;
  getByIds(
    ids: number[],
    manager?: EntityManager | undefined,
  ): Promise<RoleEntity[]>;
}
