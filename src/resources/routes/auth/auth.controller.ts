import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';

import { Request } from 'express';

import { LoginUserDto } from '@app/resources/routes/auth/dtos/login.user.dto';
import { Payload } from '@app/types/payload';
import { Public } from '@app/utils/decorators';
import { AuthService } from './auth.service';

/**
 * Controller for authentication-related routes.
 */
@Controller('auth')
export class AuthController {
  /**
   * Creates an instance of AuthController.
   * @param authService - The authentication service.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Handles user login.
   * @param login - The login credentials.
   * @returns The authentication token.
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() login: LoginUserDto) {
    return this.authService.login(login);
  }

  /**
   * Refreshes the authentication token.
   * @param request - The HTTP request object.
   * @returns The new authentication token.
   */
  @Get('refresh/token')
  refresh(@Req() request: Request) {
    const payload = request.user as Payload;
    return this.authService.refreshToken(payload);
  }

  /**
   * Retrieves the profile of the authenticated user.
   * @param request - The HTTP request object.
   * @returns The user profile.
   */
  @Get('profile')
  getProfile(@Req() request: Request) {
    return request.user;
  }
}
