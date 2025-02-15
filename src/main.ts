import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ApplicationEnv } from '@app/utils/application-settings';
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

  await app.listen(port, () => {
    Logger.log(`Server listening in port: ${port}`);
    Logger.log(`Server running in ${ApplicationEnv.NODE_ENV} environment.`);
  });
}

bootstrap();
