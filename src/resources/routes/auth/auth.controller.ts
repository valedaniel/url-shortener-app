import { Body, Controller, Get, Post, Req } from '@nestjs/common';

import { Request } from 'express';

import { LoginUserDto } from '@app/resources/routes/auth/dtos/login.user.dto';
import { Payload } from '@app/types/payload';
import { Public } from '@app/utils/decorators';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() login: LoginUserDto) {
    return this.authService.login(login);
  }

  @Get('refresh/token')
  refresh(@Req() request: Request) {
    const user = request.user as Payload;
    return this.authService.refreshToken(user);
  }

  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
