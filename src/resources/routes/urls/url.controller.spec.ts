/* eslint-disable @typescript-eslint/unbound-method */
import { UrlShortDto } from '@app/resources/routes/urls/dtos/url.short.dto';
import { UrlUpdateDto } from '@app/resources/routes/urls/dtos/url.update.dto';
import Url from '@app/resources/routes/urls/entities/url.entity';
import { UrlController } from '@app/resources/routes/urls/url.controller';
import { UrlService } from '@app/resources/routes/urls/url.service';
import { Payload } from '@app/types/payload';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';

describe('UrlController', () => {
  let urlController: UrlController;
  let service: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: {
            create: jest.fn(),
            list: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    module.useLogger(false);

    service = module.get<UrlService>(UrlService);

    urlController = module.get<UrlController>(UrlController);

    jest
      .spyOn(urlController, 'create')
      .mockImplementation(async (req: Request, body: UrlShortDto) => {
        return await service.create(req, body.url);
      });

    jest
      .spyOn(urlController, 'list')
      .mockImplementation(async (req: Request) => {
        return await service.list(req.user as Payload);
      });

    jest
      .spyOn(urlController, 'update')
      .mockImplementation(async ({ id }, req: Request, body: UrlUpdateDto) => {
        return await service.update(req, id, body);
      });

    jest.spyOn(urlController, 'delete').mockImplementation(async ({ id }) => {
      return await service.delete(id);
    });
  });

  it('should be defined', () => {
    expect(urlController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new shortened URL', async () => {
      const request = { user: { id: 1 } } as unknown as Request;
      const originalUrl = 'http://example.com';
      const body: UrlShortDto = { url: originalUrl };
      const result = {
        id: 1,
        urlShort: 'http://short.url/1',
        originalUrl,
      } as Url;

      jest.spyOn(service, 'create').mockResolvedValue(result);

      const resultCreate = await urlController.create(request, body);

      expect(resultCreate).toBe(result);
      expect(service.create).toHaveBeenCalledWith(request, body.url);
    });
  });

  describe('list', () => {
    it('should list all shortened URLs for the authenticated user', async () => {
      const request = { user: { id: 1 } } as unknown as Request;
      const result = [{ id: 1, urlShort: 'http://short.url/1' }] as Url[];

      jest.spyOn(service, 'list').mockResolvedValue(result);

      expect(await urlController.list(request)).toBe(result);
      expect(service.list).toHaveBeenCalledWith(request.user as Payload);
    });
  });

  describe('update', () => {
    it('should update an existing shortened URL', async () => {
      const request = { user: { id: 1 } } as unknown as Request;
      const originalUrl = 'http://updated.com';
      const body: UrlUpdateDto = { originalUrl };
      const result = { id: 1, originalUrl } as Url;

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await urlController.update({ id: 1 }, request, body)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(request, 1, body);
    });
  });

  describe('delete', () => {
    it('should delete an existing shortened URL', async () => {
      const result = true;

      jest.spyOn(service, 'delete').mockResolvedValue(result);

      expect(await urlController.delete({ id: 1 })).toBe(result);
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});
