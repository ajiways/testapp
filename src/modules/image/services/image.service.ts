import { EntityManager, In } from 'typeorm';
import { AbstractService } from '../../../common/services/abstarct-service';
import { EIMAGE_EXTENSION } from '../common/extensions';
import { GalleryEntity } from '../entities/gallery.entity';
import { ImageEntity } from '../entities/image.entity';
import { IImageService } from '../interfaces/image-service.interface';
import * as mime from 'mime';
import { NotFoundException } from '@nestjs/common';
import { deleteFile } from '../helpers/file';

export class ImageService
  extends AbstractService<ImageEntity>
  implements IImageService
{
  protected Entity = ImageEntity;

  public async saveImage(
    gallery: GalleryEntity,
    file: Express.Multer.File,
    manager: EntityManager | undefined,
  ): Promise<ImageEntity> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.saveImage(gallery, file, manager),
      );
    }

    return await this.saveEntity({
      filePath: file.path,
      originalFileExtension: mime.getExtension(
        file.mimetype,
      )! as EIMAGE_EXTENSION,
      originalFileName: file.originalname,
      gallery: gallery,
    });
  }

  public async getImageById(
    gallery: GalleryEntity,
    id: number,
    manager: EntityManager | undefined,
  ): Promise<ImageEntity | null> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.getImageById(gallery, id, manager),
      );
    }

    return this.findOne(
      { where: { gallery: { id: gallery.id }, id } },
      manager,
    );
  }

  public async deleteImageById(
    gallery: GalleryEntity,
    id: number,
    manager: EntityManager | undefined,
  ): Promise<ImageEntity> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.deleteImageById(gallery, id, manager),
      );
    }

    const toDelete = await this.getImageById(gallery, id, manager);

    this.checkIfImageExists(toDelete);

    await this.deleteEntity(toDelete!, manager);
    await deleteFile(toDelete!.filePath);

    return toDelete!;
  }

  public async getAllImages(
    galleries: GalleryEntity[],
    manager: EntityManager | undefined,
  ): Promise<ImageEntity[]> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.getAllImages(galleries, manager),
      );
    }

    return this.find(
      {
        where: { gallery: { id: In(galleries.map((g) => g.id)) } },
      },
      manager,
    );
  }

  public async updateImageById(
    gallery: GalleryEntity,
    id: number,
    image: Express.Multer.File,
    manager: EntityManager | undefined,
  ): Promise<ImageEntity> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.updateImageById(gallery, id, image, manager),
      );
    }

    const toUpdate = await this.getImageById(gallery, id, manager);

    this.checkIfImageExists(toUpdate);

    console.log(image);

    const updated = await this.updateEntity(
      toUpdate!,
      {
        filePath: image.path,
        originalFileName: image.originalname,
        originalFileExtension: mime.getExtension(
          image.mimetype,
        ) as EIMAGE_EXTENSION,
      },
      manager,
    );

    console.log(updated);

    await deleteFile(toUpdate!.filePath);

    return updated;
  }

  public async clearAllGalleries(
    galleries: GalleryEntity[],
    manager: EntityManager | undefined,
  ): Promise<ImageEntity[]> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.clearAllGalleries(galleries, manager),
      );
    }

    const allImages = await this.getAllImages(galleries, manager);

    await this.deleteEntities(allImages, manager);

    await Promise.all(
      allImages.map(async (img) => await deleteFile(img.filePath)),
    );

    return allImages;
  }

  private checkIfImageExists(image: ImageEntity | null) {
    if (!image) {
      throw new NotFoundException('Изображение не найдено');
    }
  }
}
