/* eslint-disable @typescript-eslint/no-floating-promises */
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ApplicationEnv } from '@app/utils/application-settings';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = ApplicationEnv.PORT;

  app.enableCors({
    origin: '*',
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ApplicationEnv.API_VERSION,
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('URL Shortener App')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(port, () => {
    Logger.log(`Server listening in port: ${port}`);
    Logger.log(`Server running in ${ApplicationEnv.NODE_ENV} environment.`);
  });
}

bootstrap();
