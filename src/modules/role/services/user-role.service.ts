import { BadRequestException, Inject } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { EUserRole } from '../../../common/enums/user-role.enum';
import { AbstractService } from '../../../common/services/abstarct-service';
import { UserEntity } from '../../user/entities/user.entity';
import { RoleEntity } from '../entities/role.entity';
import { UserRoleEntity } from '../entities/user-role.entity';
import { IRoleService } from '../interfaces/role-service.interface';
import { IUserRoleService } from '../interfaces/user-role.service.interface';
import { RoleService } from './role.service';

export class UserRoleService
  extends AbstractService<UserRoleEntity>
  implements IUserRoleService
{
  protected Entity = UserRoleEntity;

  @Inject(RoleService)
  private readonly roleService: IRoleService;

  public async attachRoleToUser(
    role: EUserRole,
    user: UserEntity,
    manager: EntityManager | undefined,
  ): Promise<UserRoleEntity> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.attachRoleToUser(role, user, manager),
      );
    }

    const roleEntity = await this.roleService.getRoleByName(role, manager);

    const candidate = await this.findOne(
      {
        where: { user: { id: user.id }, role: { id: roleEntity.id } },
      },
      manager,
    );

    if (candidate) {
      throw new BadRequestException(
        `У пользователя ${user.login} уже есть роль ${role}`,
      );
    }

    return await this.saveEntity({ role: roleEntity, user }, manager);
  }

  public async getUserRoles(
    user: UserEntity,
    manager: EntityManager | undefined,
  ): Promise<RoleEntity[]> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.getUserRoles(user, manager),
      );
    }

    const userRoles = await this.find(
      { where: { user: { id: user.id } } },
      manager,
    );

    return this.roleService.getByIds(userRoles.map((ur) => ur.role.id));
  }
}
