import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { EIMAGE_EXTENSION } from '../common/extensions';
import { GalleryEntity } from './gallery.entity';

@Entity('images')
export class ImageEntity extends BaseEntity {
  @Column({ name: 'file_path', type: 'varchar', nullable: false, unique: true })
  filePath: string;

  @Column({ name: 'original_file_name', type: 'varchar', nullable: false })
  originalFileName: string;

  @Column({
    name: 'original_file_extension',
    type: 'enum',
    enum: EIMAGE_EXTENSION,
    nullable: false,
  })
  originalFileExtension: EIMAGE_EXTENSION;

  @ManyToOne(() => GalleryEntity, (gallery) => gallery.images, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  gallery: GalleryEntity;
}
