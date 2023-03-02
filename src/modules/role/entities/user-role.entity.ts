import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { RoleEntity } from './role.entity';

@Entity('user_roles')
export class UserRoleEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    eager: true,
    nullable: false,
  })
  user: UserEntity;

  @ManyToOne(() => RoleEntity, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    eager: true,
    nullable: false,
  })
  role: RoleEntity;
}
