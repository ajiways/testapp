import { Inject } from '@nestjs/common/decorators';
import { EntityManager } from 'typeorm';
import { EUserRole } from '../../../common/enums/user-role.enum';
import { AbstractService } from '../../../common/services/abstarct-service';
import { IGalleryService } from '../../image/interfaces/gallery-service.interface';
import { GalleryService } from '../../image/services/gallery.service';
import { IUserRoleService } from '../../role/interfaces/user-role.service.interface';
import { UserRoleService } from '../../role/services/user-role.service';
import { UserEntity } from '../entities/user.entity';
import { IUserService } from '../interfaces/user-serivce.interface';

export class UserService
  extends AbstractService<UserEntity>
  implements IUserService
{
  protected Entity = UserEntity;

  @Inject(UserRoleService)
  private readonly userRoleService: IUserRoleService;

  @Inject(GalleryService)
  private readonly galleryService: IGalleryService;

  public async createUser(
    login: string,
    password: string,
    manager: EntityManager | undefined,
  ): Promise<UserEntity> {
    if (!manager) {
      return this.startTransaction((manager) =>
        this.createUser(login, password, manager),
      );
    }

    const user = await this.saveEntity({ login, password }, manager);

    const usersCount = await this.repository.count();

    if (usersCount === 0) {
      await this.userRoleService.attachRoleToUser(
        EUserRole.ADMIN,
        user,
        manager,
      );
    } else {
      await this.userRoleService.attachRoleToUser(
        EUserRole.USER,
        user,
        manager,
      );
    }

    await this.galleryService.createAndAttachGallery(user, manager);

    return user;
  }

  public async findUser(
    login: string,
    manager: EntityManager | undefined,
  ): Promise<null | UserEntity> {
    if (!manager) {
      return this.startTransaction((manager) => this.findUser(login, manager));
    }

    return await this.findOne({ where: { login } });
  }

  public async findById(
    id: number,
    manager: EntityManager | undefined,
  ): Promise<UserEntity | null> {
    if (!manager) {
      return this.startTransaction((manager) => this.findById(id, manager));
    }

    return this.findOne({ where: { id } });
  }
}
