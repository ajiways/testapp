import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterDto } from '../dto/register/register.dto';
import { AuthResponseDto } from '../dto/auth.response.dto';
import { IAuthorizationService } from '../interfaces/auth.service.interface';
import { AuthorizationService } from '../services/auth.service';
import { LoginDto } from '../dto/login/login.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UserPreviewDto } from '../../user/dto/user-preview.dto';
import { AuthorizationGuard } from '../guards/auth.guard';

@ApiTags('Auth')
@Controller('/auth')
export class AuthorizationController {
  @Inject(AuthorizationService)
  private readonly authService: IAuthorizationService;

  @ApiOperation({ description: 'Регистрация пользователя' })
  @ApiResponse({ type: AuthResponseDto, status: HttpStatus.CREATED })
  @ApiBadRequestResponse({
    type: BadRequestException,
    description: 'Ошибка регистрации',
    status: HttpStatus.BAD_REQUEST,
  })
  @Post('/register')
  async register(@Body() arg: RegisterDto) {
    return await this.authService.register(arg);
  }

  @ApiOperation({ description: 'Авторизация в системе' })
  @ApiResponse({ type: AuthResponseDto, status: HttpStatus.OK })
  @ApiBadRequestResponse({
    type: BadRequestException,
    description: 'Ошибка авторизации',
    status: HttpStatus.BAD_REQUEST,
  })
  @Post('/login')
  async login(@Body() arg: LoginDto) {
    return await this.authService.login(arg);
  }

  @UseGuards(AuthorizationGuard)
  @ApiResponse({ status: HttpStatus.OK, type: UserPreviewDto })
  @Get('/whoami')
  async whoAmI(@CurrentUser() user: UserPreviewDto) {
    return this.authService.whoAmI(user);
  }
}
