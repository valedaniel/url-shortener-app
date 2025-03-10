import { JwtAuthGuard } from '@app/guards/jwt.auth.guard';
import { JwtStrategy } from '@app/guards/jwt.strategy';
import { LoggingInterceptor } from '@app/interceptors/logging.interceptor';
import { AuthModule } from '@app/resources/routes/auth/auth.module';
import { ClickModule } from '@app/resources/routes/clicks/click.module';
import { UrlModule } from '@app/resources/routes/urls/url.module';
import { UserModule } from '@app/resources/routes/user/user.module';
import { ApplicationEnv } from '@app/utils/application-settings';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthModuleOptions } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';

const modules = [UserModule, AuthModule, UrlModule, ClickModule];

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModuleOptions,
    JwtModule.register({
      secret: ApplicationEnv.JWT_SECRET,
      global: true,
    }),
    SequelizeModule.forRoot({
      dialect: ApplicationEnv.DATABASE_DIALECT as Dialect,
      host: ApplicationEnv.DATABASE_HOST,
      port: ApplicationEnv.DATABASE_PORT,
      username: ApplicationEnv.DATABASE_USERNAME,
      password: ApplicationEnv.DATABASE_PASSWORD,
      database: ApplicationEnv.DATABASE_NAME,
      autoLoadModels: true,
      synchronize: false,
      logging: false,
      dialectOptions: {
        decimalNumbers: true,
      },
    }),
    ...modules,
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
