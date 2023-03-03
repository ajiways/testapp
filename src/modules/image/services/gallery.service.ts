import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EntityManager } from 'typeorm';
import { AbstractService } from '../../../common/services/abstarct-service';
import { UserEntity } from '../../user/entities/user.entity';
import { DeleteAllImagesResponseDto } from '../dto/delete-all-images.reponse.dto';
import { DeleteImageResponseDto } from '../dto/delete-image.response.dto';
import { ImagePreviewDto } from '../dto/image-preview.dto';
import { UpdateImageResponseDto } from '../dto/update-image.response.dto';
import { GalleryEntity } from '../entities/gallery.entity';
import { IGalleryService } from '../interfaces/gallery-service.interface';
import { IImageService } from '../interfaces/image-service.interface';
import { ImageService } from './image.service';

export class GalleryService
  extends AbstractService<GalleryEntity>
  implements IGalleryService
{
  protected Entity = GalleryEntity;

  @Inject(ImageService)
  private readonly imageService: IImageService;

  public async createAndAttachGallery(
    user: UserEntity,
    manager: EntityManager | undefined,
  ): Promise<GalleryEntity> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.createAndAttachGallery(user, manager),
      );
    }

    const existingGallery = await this.getUserGallery(user.id, manager).catch(
      () => {
        null;
      },
    );

    if (existingGallery) {
      throw new BadRequestException(
        `У пользователя ${user.login} уже имеется галерея`,
      );
    }

    return await this.saveEntity({ user }, manager);
  }

  public async addImageToGallery(
    userId: number,
    file: Express.Multer.File,
    manager: EntityManager | undefined,
  ): Promise<ImagePreviewDto> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.addImageToGallery(userId, file, manager),
      );
    }

    const gallery = await this.getUserGallery(userId, manager);

    const saved = await this.imageService.saveImage(gallery, file, manager);

    return plainToInstance(ImagePreviewDto, {
      id: saved.id,
      filePath: saved.filePath,
      originalFileName: saved.originalFileName,
    });
  }

  public async getImage(
    userId: number,
    imageId: number,
    manager: EntityManager | undefined,
  ): Promise<ImagePreviewDto> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.getImage(userId, imageId, manager),
      );
    }
    const gallery = await this.getUserGallery(userId, manager);

    const image = await this.imageService.getImageById(
      gallery,
      imageId,
      manager,
    );

    if (!image) {
      throw new NotFoundException('Изображение не найдено');
    }

    return plainToInstance(ImagePreviewDto, {
      id: image.id,
      filePath: image.filePath,
      originalFileName: image.originalFileName,
    });
  }

  public async deleteImage(
    userId: number,
    imageId: number,
    manager: EntityManager | undefined,
  ): Promise<DeleteImageResponseDto> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.deleteImage(userId, imageId, manager),
      );
    }

    const gallery = await this.getUserGallery(userId, manager);

    const deleted = await this.imageService.deleteImageById(
      gallery,
      imageId,
      manager,
    );

    return plainToInstance(DeleteImageResponseDto, {
      id: deleted.id,
      oldFilePath: deleted.filePath,
    });
  }

  public async updateImage(
    userId: number,
    imageId: number,
    newImage: Express.Multer.File,
    manager: EntityManager | undefined,
  ): Promise<UpdateImageResponseDto> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.updateImage(userId, imageId, newImage, manager),
      );
    }
    const gallery = await this.getUserGallery(userId, manager);

    const updated = await this.imageService.updateImageById(
      gallery,
      imageId,
      newImage,
      manager,
    );

    return plainToInstance(UpdateImageResponseDto, {
      newFilePath: updated.filePath,
      id: updated.id,
    });
  }

  public async deleteAllImages(
    manager: EntityManager | undefined,
  ): Promise<DeleteAllImagesResponseDto> {
    if (!manager) {
      return this.startTransaction((manager) => this.deleteAllImages(manager));
    }
    const allGalleries = await this.find({});

    const res = await this.imageService.clearAllGalleries(
      allGalleries,
      manager,
    );

    return plainToInstance(DeleteAllImagesResponseDto, { count: res.length });
  }

  private async getUserGallery(
    userId: number,
    manager: EntityManager,
  ): Promise<GalleryEntity> {
    const gallery = await this.findOne(
      { where: { user: { id: userId } } },
      manager,
    );

    if (!gallery) {
      throw new NotFoundException('У пользователя отсутствует галлерея');
    }

    return gallery;
  }
}
