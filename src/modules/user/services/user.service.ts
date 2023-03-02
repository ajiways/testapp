import { Inject } from '@nestjs/common/decorators';
import { plainToInstance } from 'class-transformer';
import { EntityManager } from 'typeorm';
import { EUserRole } from '../../../common/enums/user-role.enum';
import { AbstractService } from '../../../common/services/abstarct-service';
import { IUserRoleService } from '../../role/interfaces/user-role.service.interface';
import { UserRoleService } from '../../role/services/user-role.service';
import { UserPreviewDto } from '../dto/user-preview.dto';
import { UserEntity } from '../entities/user.entity';
import { IUserService } from '../interfaces/user-serivce.interface';

export class UserService
  extends AbstractService<UserEntity>
  implements IUserService
{
  protected Entity = UserEntity;

  @Inject(UserRoleService)
  private readonly userRoleService: IUserRoleService;

  public async createUser(
    login: string,
    password: string,
    manager: EntityManager | undefined,
  ): Promise<UserPreviewDto> {
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

    return plainToInstance(UserPreviewDto, user, {
      excludeExtraneousValues: true,
    });
  }

  public async findUser(
    login: string,
    manager: EntityManager | undefined,
  ): Promise<null | UserEntity> {
    if (!manager) {
      return this.startTransaction((manager) => this.findUser(login, manager));
    }

    const candidate = await this.findOne({ where: { login } });

    if (candidate) {
      return candidate;
    }

    return null;
  }
}
