import { Controller, HttpStatus, Post } from '@nestjs/common';
import {
  Delete,
  Get,
  Inject,
  Param,
  Put,
  UploadedFile,
  UseGuards,
} from '@nestjs/common/decorators';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiFile } from '../../../common/decorators/api-file.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { EUserRole } from '../../../common/enums/user-role.enum';
import { AuthorizationGuard } from '../../auth/guards/auth.guard';
import { RequireRoles, RolesGuard } from '../../auth/guards/roles.guard';
import { UserPreviewDto } from '../../user/dto/user-preview.dto';
import { IMAGE_EXTENSIONS } from '../common/extensions';
import { imagesStorage } from '../common/images.storage';
import { statisticsUpdateApiSchema } from '../common/schemas/update-image.schema';
import { statisticsUploadApiSchema } from '../common/schemas/upload-image.schema';
import { MAX_IMAGE_SIZE } from '../constants/constants';
import { DeleteAllImagesResponseDto } from '../dto/delete-all-images.reponse.dto';
import { DeleteImageResponseDto } from '../dto/delete-image.response.dto';
import { ImagePreviewDto } from '../dto/image-preview.dto';
import { UpdateImageResponseDto } from '../dto/update-image.response.dto';
import { IGalleryService } from '../interfaces/gallery-service.interface';
import { GalleryService } from '../services/gallery.service';
import { fileExtensionFilter } from '../validators/file-extension.validator';

@ApiTags('Images')
@UseGuards(RolesGuard, AuthorizationGuard)
@Controller('/image')
export class ImageController {
  @Inject(GalleryService)
  private readonly galleryService: IGalleryService;

  @ApiOperation({ description: 'Загрузка изображения' })
  @ApiFile(
    'image',
    true,
    {
      fileFilter: fileExtensionFilter(...IMAGE_EXTENSIONS),
      storage: imagesStorage,
      limits: {
        fileSize: MAX_IMAGE_SIZE,
      },
    },
    statisticsUploadApiSchema,
  )
  @ApiResponse({ type: ImagePreviewDto, status: HttpStatus.CREATED })
  @Post()
  async uploadImage(
    @UploadedFile() image: Express.Multer.File,
    @CurrentUser() user: UserPreviewDto,
  ) {
    return await this.galleryService.addImageToGallery(user.userId, image);
  }

  @ApiOperation({ description: 'Обновить изображение' })
  @ApiResponse({ type: UpdateImageResponseDto, status: HttpStatus.CREATED })
  @ApiParam({ name: 'id', type: 'number', description: 'ID изображения' })
  @ApiFile(
    'image',
    true,
    {
      fileFilter: fileExtensionFilter(...IMAGE_EXTENSIONS),
      storage: imagesStorage,
      limits: {
        fileSize: MAX_IMAGE_SIZE,
      },
    },
    statisticsUpdateApiSchema,
  )
  @Put('/:id')
  async updateImage(
    @UploadedFile() image: Express.Multer.File,
    @CurrentUser() user: UserPreviewDto,
    @Param('id') id: number,
  ) {
    return await this.galleryService.updateImage(user.userId, id, image);
  }

  @ApiOperation({ description: 'Получить изображение' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID изображения' })
  @ApiResponse({ type: ImagePreviewDto, status: HttpStatus.OK })
  @Get('/:id')
  async getImage(@CurrentUser() user: UserPreviewDto, @Param('id') id: number) {
    return await this.galleryService.getImage(user.userId, id);
  }

  @ApiOperation({ description: 'Удалить все изображения (для администратора)' })
  @ApiResponse({ type: DeleteAllImagesResponseDto, status: HttpStatus.OK })
  @RequireRoles([EUserRole.ADMIN])
  @Delete('/all')
  async deleteAllImages() {
    return await this.galleryService.deleteAllImages();
  }

  @ApiOperation({ description: 'Удалить изображение' })
  @ApiResponse({ type: DeleteImageResponseDto, status: HttpStatus.CREATED })
  @ApiParam({ name: 'id', type: 'number', description: 'ID изображения' })
  @Delete('/:id')
  async deleteImage(
    @CurrentUser() user: UserPreviewDto,
    @Param('id') id: number,
  ) {
    return await this.galleryService.deleteImage(user.userId, id);
  }
}
