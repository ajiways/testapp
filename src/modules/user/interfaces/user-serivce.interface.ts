import { EntityManager } from 'typeorm';
import { THashedPassword } from '../../auth/types/hashed-password.type';
import { UserPreviewDto } from '../dto/user-preview.dto';
import { UserEntity } from '../entities/user.entity';

export interface IUserService {
  createUser(
    login: string,
    password: THashedPassword,
    manager?: EntityManager | undefined,
  ): Promise<UserPreviewDto>;

  findUser(
    login: string,
    manager?: EntityManager | undefined,
  ): Promise<UserEntity | null>;

  findById(
    id: number,
    manager?: EntityManager | undefined,
  ): Promise<UserEntity | null>;
}
