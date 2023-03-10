import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { EUserRole } from '../../../common/enums/user-role.enum';
import { IUserService } from '../../user/interfaces/user-serivce.interface';
import { UserService } from '../../user/services/user.service';
import { IUserRoleService } from '../../role/interfaces/user-role.service.interface';
import { UserRoleService } from '../../role/services/user-role.service';
import { Reflector } from '@nestjs/core';

export const RequireRoles = (roles: EUserRole[]) =>
  SetMetadata('requiredRoles', roles);

type ReqWithHeaders = {
  headers: { ['x-user-id']: string };
};

@Injectable()
export class RolesGuard implements CanActivate {
  @Inject(UserRoleService)
  private readonly userRoleService: IUserRoleService;

  @Inject(UserService)
  private readonly userService: IUserService;

  @Inject()
  private readonly reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { headers } = context.switchToHttp().getRequest<ReqWithHeaders>();

    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    if (!headers['x-user-id'] || headers['x-user-id'] === 'null') {
      return false;
    }

    const userId = Number(headers['x-user-id']);

    const user = await this.userService.findById(userId);

    if (!user) {
      return false;
    }

    const requiredRoles =
      this.reflector.get<EUserRole[]>('requiredRoles', context.getHandler()) ||
      [];

    if (!requiredRoles.length) {
      return true;
    }

    const userRoles = await this.userRoleService
      .getUserRoles(user)
      .then((roles) => roles.map((role) => role.role));

    for (const rr of requiredRoles) {
      if (!userRoles.includes(rr)) {
        return false;
      }
    }

    return true;
  }
}
