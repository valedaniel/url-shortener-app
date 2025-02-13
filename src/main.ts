import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 5000;

  app.enableCors({
    origin: '*',
  });

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: process.env.API_VERSION,
  });

  await app.listen(port, () => {
    Logger.log(`Server listening in port: ${port}`);
    Logger.log(
      `Server running in ${process.env.NODE_ENV || 'unknown'} environment.`,
    );
  });
}

bootstrap();
