import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPreviewDto } from '../../modules/user/dto/user-preview.dto';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserPreviewDto => {
    const request = ctx.switchToHttp().getRequest<{ user: UserPreviewDto }>();

    return request.user;
  },
);
