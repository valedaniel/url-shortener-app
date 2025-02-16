import { WELCOME_MESSAGE } from '@app/utils/constants';
import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { ClickController } from './click.controller';
import { ClickService } from './click.service';

describe('ClickController', () => {
  let clickController: ClickController;
  let clickService: ClickService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClickController],
      providers: [
        {
          provide: ClickService,
          useValue: {
            clicking: jest.fn(),
          },
        },
      ],
    }).compile();

    clickController = module.get<ClickController>(ClickController);
    clickService = module.get<ClickService>(ClickService);
  });

  describe('clicking', () => {
    it('should return the original URL and set status to TEMPORARY_REDIRECT', async () => {
      const requestWithUser = {
        user: { id: 1 },
      } as unknown as Request;

      const response = {
        redirect: jest.fn(),
      } as unknown as Response;

      const code = 'test-code';
      const originalURL = 'http://original-url.com';

      jest.spyOn(clickService, 'clicking').mockResolvedValue(originalURL);

      await clickController.clicking(requestWithUser, response, code);

      expect(clickService.clicking).toHaveBeenCalledWith(
        requestWithUser,
        code,
        requestWithUser.user,
      );
      expect(response.redirect).toHaveBeenCalledWith(
        HttpStatus.TEMPORARY_REDIRECT,
        originalURL,
      );
    });
  });

  describe('welcome', () => {
    it('should return welcome message', async () => {
      const result = await clickController.welcome();
      expect(result).toBe(WELCOME_MESSAGE);
    });
  });
});
