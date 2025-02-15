import Url from '@app/resources/routes/urls/entities/url.entity';
import { UrlController } from '@app/resources/routes/urls/url.controller';
import { UrlService } from '@app/resources/routes/urls/url.service';
import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

const entities = [Url];
const services = [UrlService];

@Module({
  exports: services,
  imports: [SequelizeModule.forFeature(entities)],
  controllers: [UrlController],
  providers: services,
})
export class UrlModule {}
