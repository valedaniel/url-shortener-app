import { TokenService } from '@app/resources/private/token/token.service';
import { LoginUserDto } from '@app/resources/routes/auth/dtos/login.user.dto';
import { AuthResponse } from '@app/resources/routes/auth/types/auth.response';
import User from '@app/resources/routes/user/entities/user.entity';
import { Payload } from '@app/types/payload';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

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

      const { password: _, ...userWithoutPassword } = user.toJSON();

      this.logger.log(`User (${user.id}) logged in successfully`);

      return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      } as AuthResponse;
    } catch (err) {
      this.logger.error('Login failed', { error: err.message });
      throw err;
    }
  }

  /**
   * Generates new access and refresh tokens based on the provided payload.
   * @param payload - The payload containing user information.
   * @returns An object containing the new access token and refresh token.
   */
  async refreshToken(payload: Payload) {
    this.logger.log(`Refreshing tokens User (${payload.id})`);

    try {
      return this.tokenService.generateTokens(payload as User);
    } catch (error) {
      this.logger.error('Error refreshing tokens', { error });
      throw error;
    }
  }
}
