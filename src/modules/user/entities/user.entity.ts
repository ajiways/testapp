import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { GalleryEntity } from '../../image/entities/gallery.entity';

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

  @OneToOne(() => GalleryEntity, (gallery) => gallery.user)
  @JoinColumn()
  gallery: GalleryEntity;
}
