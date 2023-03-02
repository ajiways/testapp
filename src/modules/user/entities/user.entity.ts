import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({
    name: 'login',
    type: 'varchar',
    length: 12,
    nullable: false,
    unique: true,
  })
  login: string;

  @Column({ name: 'password', type: 'varchar', nullable: false })
  password: string;
}
