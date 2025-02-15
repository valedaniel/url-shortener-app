import { ClickProducer } from '@app/queues/click/click.producer';
import { Payload } from '@app/types/payload';
import { getFullDomain } from '@app/utils/getFullDomain';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from '../urls/url.service';
import { ClickService } from './click.service';
import Click from './entities/click.entity';

jest.mock('@app/utils/getFullDomain');

describe('ClickService', () => {
  let service: ClickService;
  let urlService: UrlService;
  let clickProducer: ClickProducer;

  const mockClickRepository = {};
  const mockUrlService = {
    findByDomain: jest.fn(),
  };
  const mockClickProducer = {
    addClick: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClickService,
        { provide: getModelToken(Click), useValue: mockClickRepository },
        { provide: UrlService, useValue: mockUrlService },
        { provide: ClickProducer, useValue: mockClickProducer },
      ],
    }).compile();

    service = module.get<ClickService>(ClickService);
    urlService = module.get<UrlService>(UrlService);
    clickProducer = module.get<ClickProducer>(ClickProducer);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('clicking', () => {
    it('should return the original URL if found', async () => {
      const request = { headers: { host: 'example.com' } } as any;
      const code = 'hdmcsa';
      const domain = 'http://example.com';

      const payload = { id: 1 } as Payload;
      const url = { id: 1, originalUrl: 'http://original-url.com' };

      (getFullDomain as jest.Mock).mockReturnValue(domain);
      mockUrlService.findByDomain.mockResolvedValue(url);

      const result = await service.clicking(request, code, payload);

      expect(result).toBe(url.originalUrl);
      expect(mockUrlService.findByDomain).toHaveBeenCalledWith(
        `${domain}/${code}`,
      );
      expect(mockClickProducer.addClick).toHaveBeenCalledWith({
        userId: payload.id,
        urlId: url.id,
      });
    });

    it('should throw an HttpException if the URL is not found', async () => {
      const request = { headers: { host: 'example.com' } } as any;
      const code = 'c54hcv';
      const domain = 'http://example.com';

      (getFullDomain as jest.Mock).mockReturnValue(domain);
      mockUrlService.findByDomain.mockResolvedValue(null);

      await expect(service.clicking(request, code)).rejects.toThrow(
        new HttpException('URL not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
