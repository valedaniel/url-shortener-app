import { TokenService } from '@app/resources/private/token/token.service';
import { LoginUserDto } from '@app/resources/routes/auth/dtos/login.user.dto';
import { AuthResponse } from '@app/resources/routes/auth/types/auth.response';
import { RefreshTokenResponse } from '@app/resources/routes/auth/types/refresh.token.response';
import User from '@app/resources/routes/user/entities/user.entity';
import { Payload } from '@app/types/payload';
import { handleError } from '@app/utils/handleError';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { Optional } from 'sequelize';

/**
 * AuthService handles authentication-related operations such as login and token refresh.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  /**
   * Constructs an instance of AuthService.
   * @param tokenService - Service for handling token generation and validation.
   * @param userRepository - Repository for accessing user data.
   */
  constructor(
    private readonly tokenService: TokenService,
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  /**
   * Authenticates a user with the provided login credentials.
   * @param login - Data transfer object containing user's email and password.
   * @returns An object containing the authenticated user's data (excluding password), access token, and refresh token.
   * @throws HttpException - Throws an unauthorized exception if authentication fails.
   */
  async login(login: LoginUserDto) {
    this.logger.log('Attempting to log in user');

    try {
      const { email, password } = login;

      const error = new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

      const user = await this.userRepository.findOne({
        where: { email },
      });
      if (!user) throw error;

      const isValid = bcrypt.compareSync(password, user?.password);
      if (!isValid) throw error;

      const { accessToken, refreshToken } =
        this.tokenService.generateTokens(user);

      const userWithoutPassword: Optional<User, 'password'> =
        user.toJSON<User>();

      delete userWithoutPassword.password;

      this.logger.log(`User (${user.id}) logged in successfully`);

      return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      } as AuthResponse;
    } catch (err) {
      this.logger.error('Login failed Unauthorized');
      throw err;
    }
  }

  /**
   * Generates new access and refresh tokens based on the provided payload.
   * @param payload - The payload containing user information.
   * @returns An object containing the new access token and refresh token.
   */
  refreshToken(payload: Payload) {
    this.logger.log(`Refreshing tokens User (${payload.id})`);

    try {
      return this.tokenService.generateTokens(
        payload as User,
      ) as RefreshTokenResponse;
    } catch (error) {
      handleError(error, this.logger, 'Error refreshing tokens');
      throw error;
    }
  }
}
