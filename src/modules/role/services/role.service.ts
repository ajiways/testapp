import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';
import { EUserRole } from '../../../common/enums/user-role.enum';
import { AbstractService } from '../../../common/services/abstarct-service';
import { RoleEntity } from '../entities/role.entity';
import { IRoleService } from '../interfaces/role-service.interface';

@Injectable()
export class RoleService
  extends AbstractService<RoleEntity>
  implements IRoleService
{
  protected Entity = RoleEntity;

  public async getRoleByName(
    name: EUserRole,
    manager: EntityManager | undefined,
  ): Promise<RoleEntity> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.getRoleByName(name, manager),
      );
    }

    const candidate = await this.findOne({ where: { role: name } }, manager);

    if (!candidate) {
      throw new NotFoundException('Роль не найдена');
    }

    return candidate;
  }

  public async getByIds(
    ids: number[],
    manager: EntityManager | undefined,
  ): Promise<RoleEntity[]> {
    if (!manager) {
      return this.startTransaction((manager) => this.getByIds(ids, manager));
    }

    return this.find({ where: { id: In(ids) } });
  }
}
