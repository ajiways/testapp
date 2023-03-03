import { EntityManager } from 'typeorm';
import { GalleryEntity } from '../entities/gallery.entity';
import { ImageEntity } from '../entities/image.entity';

export interface IImageService {
  saveImage(
    gallery: GalleryEntity,
    file: Express.Multer.File,
    manager?: EntityManager | undefined,
  ): Promise<ImageEntity>;
  getImageById(
    gallery: GalleryEntity,
    id: number,
    manager?: EntityManager | undefined,
  ): Promise<ImageEntity | null>;
  deleteImageById(
    gallery: GalleryEntity,
    id: number,
    manager?: EntityManager | undefined,
  ): Promise<ImageEntity>;
  getAllImages(
    galleries: GalleryEntity[],
    manager?: EntityManager | undefined,
  ): Promise<ImageEntity[]>;
  updateImageById(
    gallery: GalleryEntity,
    id: number,
    image: Express.Multer.File,
    manager?: EntityManager | undefined,
  ): Promise<ImageEntity>;
  clearAllGalleries(
    galleries: GalleryEntity[],
    manager?: EntityManager | undefined,
  ): Promise<ImageEntity[]>;
}
