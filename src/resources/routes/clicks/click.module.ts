import { ClickController } from '@app/resources/routes/clicks/click.controller';
import { ClickService } from '@app/resources/routes/clicks/click.service';
import Click from '@app/resources/routes/clicks/entities/click.entity';
import { UrlModule } from '@app/resources/routes/urls/url.module';
import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

const entities = [Click];
const services = [ClickService];

@Module({
  exports: services,
  imports: [SequelizeModule.forFeature(entities), UrlModule],
  controllers: [ClickController],
  providers: services,
})
export class ClickModule {}
