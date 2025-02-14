import { Module } from '@nestjs/common';

import { UserController } from './user.controller';

import { UserService } from './user.service';

import { SequelizeModule } from '@nestjs/sequelize';
import User from './entities/user.entity';

const entities = [User];
const services = [UserService];

@Module({
  exports: services,
  imports: [SequelizeModule.forFeature(entities)],
  controllers: [UserController],
  providers: services,
})
export class UserModule {}
