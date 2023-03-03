import { EntityManager } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { DeleteAllImagesResponseDto } from '../dto/delete-all-images.reponse.dto';
import { DeleteImageResponseDto } from '../dto/delete-image.response.dto';
import { ImagePreviewDto } from '../dto/image-preview.dto';
import { UpdateImageResponseDto } from '../dto/update-image.response.dto';
import { GalleryEntity } from '../entities/gallery.entity';

export interface IGalleryService {
  createAndAttachGallery(
    user: UserEntity,
    manager?: EntityManager | undefined,
  ): Promise<GalleryEntity>;
  addImageToGallery(
    userId: number,
    file: Express.Multer.File,
    manager?: EntityManager | undefined,
  ): Promise<ImagePreviewDto>;
  getImage(
    userId: number,
    imageId: number,
    manager?: EntityManager | undefined,
  ): Promise<ImagePreviewDto>;
  deleteImage(
    userId: number,
    imageId: number,
    manager?: EntityManager | undefined,
  ): Promise<DeleteImageResponseDto>;
  updateImage(
    userId: number,
    imageId: number,
    newImage: Express.Multer.File,
    manager?: EntityManager | undefined,
  ): Promise<UpdateImageResponseDto>;
  deleteAllImages(
    manager?: EntityManager | undefined,
  ): Promise<DeleteAllImagesResponseDto>;
}
