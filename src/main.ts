import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { resolve } from 'path';
import { AppModule } from './app.module';
import { ConfigurationService } from './config/configuration/configuration.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configServive = app.get<ConfigurationService>(ConfigurationService);
  app.useStaticAssets(resolve('./uploads'));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        exposeDefaultValues: true,
      },
    }),
  );

  bootstrapSwagger(app);

  await app.listen(configServive.env.APP_PORT, configServive.env.APP_HOST);
}

function bootstrapSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API картинок')
    .setDescription('Тестовое задание для DFA MEDIA')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}

bootstrap();
