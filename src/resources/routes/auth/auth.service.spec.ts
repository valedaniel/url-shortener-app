import { TokenModule } from '@app/resources/private/token/token.module';
import { TokenService } from '@app/resources/private/token/token.service';
import User from '@app/resources/routes/user/entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let tokenService: TokenService;
  let userRepository: typeof User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TokenModule,
        JwtModule.register({
          secret: 'testSecret',
          signOptions: { expiresIn: '60s' },
          global: true,
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getModelToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    tokenService = module.get<TokenService>(TokenService);
    userRepository = module.get<typeof User>(getModelToken(User));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should throw an error if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        authService.login({ email: 'test@example.com', password: 'password' }),
      ).rejects.toThrow(
        new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should throw an error if password is invalid', async () => {
      const user = { email: 'test@example.com', password: 'hashedPassword' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as User);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      await expect(
        authService.login({ email: 'test@example.com', password: 'password' }),
      ).rejects.toThrow(
        new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should return tokens and user data if login is successful', async () => {
      const user = {
        email: 'test@example.com',
        password: 'hashedPassword',
        toJSON: jest.fn().mockReturnValue({ email: 'test@example.com' }),
      };
      const tokens = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(user as unknown as User);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      jest.spyOn(tokenService, 'generateTokens').mockReturnValue(tokens);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result).toEqual({
        user: { email: 'test@example.com' },
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
    });
  });

  describe('refreshToken', () => {
    it('should return new tokens', async () => {
      const payload = { id: 1, email: 'test@example.com' } as User;
      const tokens = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };
      jest.spyOn(tokenService, 'generateTokens').mockReturnValue(tokens);

      const result = await authService.refreshToken(payload);

      expect(result).toEqual(tokens);
    });
  });
});
