import { plainToInstance } from 'class-transformer';
import { EntityManager } from 'typeorm';
import { AbstractService } from '../../../common/services/abstarct-service';
import { UserPreviewDto } from '../dto/user-preview.dto';
import { UserEntity } from '../entities/user.entity';
import { IUserService } from '../interfaces/user-serivce.interface';

export class UserService
  extends AbstractService<UserEntity>
  implements IUserService
{
  protected Entity = UserEntity;

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

    const user = await this.saveEntity({ login, password });

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
