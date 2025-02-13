import { AppService } from '@app/app.service';
import { JwtAuthGuard } from '@app/guards/jwt.auth.guard';
import { JwtStrategy } from '@app/guards/jwt.strategy';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthModuleOptions } from '@nestjs/passport';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModuleOptions,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
