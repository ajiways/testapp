import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { EUserRole } from '../../../common/enums/user-role.enum';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @Column({ type: 'enum', enum: EUserRole, name: 'role', nullable: false })
  role: EUserRole;
}
