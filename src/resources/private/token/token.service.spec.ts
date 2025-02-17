/* eslint-disable @typescript-eslint/unbound-method */
import User from '@app/resources/routes/user/entities/user.entity';
import {
  JWT_ACCESS_TOKEN_EXPIRES,
  JWT_ALGORITHM,
  JWT_REFRESH_TOKEN_EXPIRES,
} from '@app/utils/constants';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    module.useLogger(false);

    service = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTokens', () => {
    it('should throw an error if user data is invalid', () => {
      expect(() => service.generateTokens({} as User)).toThrow(
        new HttpException('Invalid user data', HttpStatus.BAD_REQUEST),
      );
    });

    it('should return access and refresh tokens', () => {
      const user = { id: 1, email: 'test@example.com' };
      const payload = { id: user.id, email: user.email };
      const accessToken = 'accessToken';
      const refreshToken = 'refreshToken';

      jest.spyOn(jwtService, 'sign').mockImplementation((payload, options) => {
        if (options) {
          if (options.expiresIn === JWT_ACCESS_TOKEN_EXPIRES)
            return accessToken;
          if (options.expiresIn === JWT_REFRESH_TOKEN_EXPIRES)
            return refreshToken;
        }

        return '';
      });

      const tokens = service.generateTokens(user as User);

      expect(tokens).toEqual({ accessToken, refreshToken });
      expect(jwtService.sign).toHaveBeenCalledWith(payload, {
        expiresIn: JWT_ACCESS_TOKEN_EXPIRES,
        algorithm: JWT_ALGORITHM,
      });
      expect(jwtService.sign).toHaveBeenCalledWith(payload, {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRES,
        algorithm: JWT_ALGORITHM,
      });
    });

    it('should throw an error if token generation fails', () => {
      const user = { id: '1', email: 'test@example.com' };

      jest.spyOn(jwtService, 'sign').mockImplementation(() => {
        throw new Error('Token generation error');
      });

      expect(() => service.generateTokens(user as unknown as User)).toThrow(
        new HttpException(
          'Error generating tokens',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
