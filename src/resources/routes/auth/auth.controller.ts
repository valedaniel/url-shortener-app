import { AuthService } from '@app/resources/routes/auth/auth.service';
import { LoginUserDto } from '@app/resources/routes/auth/dtos/login.user.dto';
import { AuthResponse } from '@app/resources/routes/auth/types/auth.response';
import { Error } from '@app/types/error';
import { Payload } from '@app/types/payload';
import { Public } from '@app/utils/decorators';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

/**
 * Controller for authentication-related routes.
 */
@Controller('api/auth')
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
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: Error,
  })
  login(@Body() login: LoginUserDto) {
    return this.authService.login(login);
  }

  /**
   * Refreshes the authentication token.
   * @param request - The HTTP request object.
   * @returns The new authentication token.
   */
  @Get('refresh/token')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh authentication token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      example: {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: Error,
  })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: Payload,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: Error,
  })
  getProfile(@Req() request: Request) {
    return request.user as Payload;
  }
}
