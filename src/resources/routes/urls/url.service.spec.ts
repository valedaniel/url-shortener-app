import { UrlUpdateDto } from '@app/resources/routes/urls/dtos/url.update.dto';
import Url from '@app/resources/routes/urls/entities/url.entity';
import { UrlService } from '@app/resources/routes/urls/url.service';
import { Payload } from '@app/types/payload';
import { shortenUrl } from '@app/utils/shortenUrl';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';

jest.mock('@app/utils/shortenUrl');

describe('UrlService', () => {
  let service: UrlService;
  let urlRepository: typeof Url;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getModelToken(Url),
          useValue: {
            findByPk: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    urlRepository = module.get<typeof Url>(getModelToken(Url));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByIdOrThrow', () => {
    it('should return a URL if found', async () => {
      const url = { id: 1 } as Url;
      jest.spyOn(urlRepository, 'findByPk').mockResolvedValue(url);

      expect(await service.findByIdOrThrow(1)).toEqual(url);
    });

    it('should throw an exception if URL not found', async () => {
      jest.spyOn(urlRepository, 'findByPk').mockResolvedValue(null);

      await expect(service.findByIdOrThrow(1)).rejects.toThrow(
        new HttpException('URL not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findByDomain', () => {
    it('should return a URL if found', async () => {
      const url = { urlShort: 'short' } as Url;
      jest.spyOn(urlRepository, 'findOne').mockResolvedValue(url);

      expect(await service.findByDomain('short')).toEqual(url);
    });
  });

  describe('validateUrlDuplicated', () => {
    it('should throw an exception if URL already exists', async () => {
      const originalUrl = 'http://example.com';

      const url = { originalUrl } as Url;
      jest.spyOn(urlRepository, 'findOne').mockResolvedValue(url);

      await expect(service.validateUrlDuplicated(originalUrl)).rejects.toThrow(
        new HttpException('URL already exists', HttpStatus.CONFLICT),
      );
    });

    it('should not throw an exception if URL does not exist', async () => {
      jest.spyOn(urlRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.validateUrlDuplicated('http://example.com'),
      ).resolves.not.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new shortened URL', async () => {
      const payload = { id: 1 } as Payload;
      const request = {
        user: payload,
      } as unknown as Request;
      const originalUrl = 'http://example.com';
      const urlShort = 'short';
      const createdUrl = { originalUrl, urlShort, ownerId: payload.id };

      (shortenUrl as jest.Mock).mockReturnValue(urlShort);
      jest.spyOn(urlRepository, 'create').mockResolvedValue(createdUrl as any);
      jest.spyOn(service, 'validateUrlDuplicated').mockResolvedValue(undefined);

      expect(await service.create(request, originalUrl)).toEqual(createdUrl);
    });
  });

  describe('list', () => {
    it('should return a list of URLs for a given owner', async () => {
      const payload = { id: 1 } as Payload;
      const urls = [
        {
          id: 1,
          originalUrl: 'http://example.com',
          urlShort: 'short',
          totalClicks: 10,
        },
      ];

      jest
        .spyOn(urlRepository, 'findAll')
        .mockResolvedValue(urls as unknown as Url[]);

      expect(await service.list(payload)).toEqual(urls);
    });
  });

  describe('update', () => {
    it('should update an existing URL', async () => {
      const request = {} as Request;
      const id = 1;
      const body = { originalUrl: 'http://example.com' } as UrlUpdateDto;
      const urlShort = 'http://urlshortexample.com';
      const updatedUrl = { id, originalUrl: body.originalUrl, urlShort };

      (shortenUrl as jest.Mock).mockReturnValue(urlShort);
      jest.spyOn(service, 'validateUrlDuplicated').mockResolvedValue(undefined);
      jest.spyOn(urlRepository, 'update').mockResolvedValue([1]);
      jest
        .spyOn(service, 'findByIdOrThrow')
        .mockResolvedValue(updatedUrl as Url);

      expect(await service.update(request, id, body)).toEqual(updatedUrl);
    });
  });

  describe('delete', () => {
    it('should delete a URL entry by its ID', async () => {
      const id = 1;

      jest.spyOn(urlRepository, 'destroy').mockResolvedValue(1);

      expect(await service.delete(id)).toBe(true);
    });

    it('should return false if no URL entry was deleted', async () => {
      const id = 1;

      jest.spyOn(urlRepository, 'destroy').mockResolvedValue(0);

      expect(await service.delete(id)).toBe(false);
    });
  });
});
