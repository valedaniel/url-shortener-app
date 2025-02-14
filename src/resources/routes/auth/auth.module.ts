import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';

import { TokenModule } from '@app/resources/private/token/token.module';
import User from '@app/resources/routes/user/entities/user.entity';
import { AuthService } from './auth.service';

const entities = [User];
const services = [AuthService];

@Module({
  exports: services,
  imports: [UserModule, TokenModule, SequelizeModule.forFeature(entities)],
  controllers: [AuthController],
  providers: services,
})
export class AuthModule {}
