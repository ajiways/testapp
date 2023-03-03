import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { ImageEntity } from './image.entity';

@Entity('galleries')
export class GalleryEntity extends BaseEntity {
  @OneToOne(() => UserEntity, (user) => user.gallery, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => ImageEntity, (image) => image.gallery)
  images: ImageEntity[];
}
