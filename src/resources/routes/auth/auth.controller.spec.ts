import { LoginUserDto } from '@app/resources/routes/auth/dtos/login.user.dto';
import { Payload } from '@app/types/payload';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            refreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should call AuthService.login with correct parameters', async () => {
      const loginDto: LoginUserDto = {
        email: 'test@email.com',
        password: 'test',
      };
      const result = {
        user: loginDto,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };
      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(loginDto)).toBe(result);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('refresh', () => {
    it('should call AuthService.refreshToken with correct parameters', async () => {
      const user = { id: 1, email: 'test@email.com' };

      const request = { user };
      const payload: Payload = user;
      const result = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };
      jest.spyOn(authService, 'refreshToken').mockResolvedValue(result);

      expect(await authController.refresh(request as unknown as Request)).toBe(
        result,
      );
      expect(authService.refreshToken).toHaveBeenCalledWith(payload);
    });
  });

  describe('getProfile', () => {
    it('should return the user from the request', () => {
      const request = {
        user: { id: 1, email: 'test@email.com' } as Payload,
      };

      expect(authController.getProfile(request as unknown as Request)).toBe(
        request.user,
      );
    });
  });
});
