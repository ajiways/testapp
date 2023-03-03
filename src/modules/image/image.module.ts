import { forwardRef, Module } from '@nestjs/common';
import { ImageController } from './controllers/image.controller';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { GalleryEntity } from './entities/gallery.entity';
import { ImageEntity } from './entities/image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryService } from './services/gallery.service';
import { ImageService } from './services/image.service';

const modules = [RoleModule, forwardRef(() => UserModule)];
const entities = [GalleryEntity, ImageEntity];
const services = [GalleryService, ImageService];

@Module({
  providers: [...services],
  imports: [TypeOrmModule.forFeature(entities), ...modules],
  controllers: [ImageController],
  exports: [...services],
})
export class ImageModule {}
