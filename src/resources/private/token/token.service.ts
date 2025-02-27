import User from '@app/resources/routes/user/entities/user.entity';
import { Payload } from '@app/types/payload';
import {
  JWT_ACCESS_TOKEN_EXPIRES,
  JWT_ALGORITHM,
  JWT_REFRESH_TOKEN_EXPIRES,
} from '@app/utils/constants';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/**
 * Service responsible for generating JWT tokens.
 */
@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  /**
   * Constructs the TokenService.
   * @param jwtService - The JWT service used to sign tokens.
   */
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generates access and refresh tokens for a given user.
   * @param user - The user for whom the tokens are being generated.
   * @returns An object containing the access token and refresh token.
   * @throws HttpException - Throws an exception if user data is invalid or if there is an error generating tokens.
   */
  generateTokens(user: User) {
    this.logger.log(`Generating tokens for user (${user?.id})`);

    if (!user?.id || !user?.email) {
      throw new HttpException('Invalid user data', HttpStatus.BAD_REQUEST);
    }

    const payload: Payload = {
      id: user.id,
      email: user.email,
    };

    try {
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: JWT_ACCESS_TOKEN_EXPIRES,
        algorithm: JWT_ALGORITHM,
      });

      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRES,
        algorithm: JWT_ALGORITHM,
      });

      this.logger.log(`Tokens generated successfully (${user?.id})`);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error(
        `Error generating tokens for user (${user?.id}): ${error}`,
      );
      throw new HttpException(
        'Error generating tokens',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
