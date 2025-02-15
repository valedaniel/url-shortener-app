import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import Click from '@app/resources/routes/clicks/entities/click.entity';
import { UrlService } from '@app/resources/routes/urls/url.service';
import { Payload } from '@app/types/payload';
import { getFullDomain } from '@app/utils/getFullDomain';
import { Request } from 'express';

/**
 * Service responsible for handling click events on shortened URLs.
 */
@Injectable()
export class ClickService {
  /**
   * Constructs a new instance of the ClickService.
   *
   * @param clickRepository - The repository for managing Click entities.
   * @param urlService - The service for handling URL-related operations.
   */
  constructor(
    @InjectModel(Click)
    private readonly clickRepository: typeof Click,
    private readonly urlService: UrlService,
  ) {}

  /**
   * Handles a click event on a shortened URL.
   *
   * @param request - The HTTP request object.
   * @param code - The shortened URL code.
   * @param payload - Optional payload containing user information.
   * @returns The original URL if found.
   * @throws HttpException if the URL is not found.
   */
  async clicking(request: Request, code: string, payload?: Payload) {
    const fullDomain = getFullDomain(request);

    const url = await this.urlService.findByDomain(`${fullDomain}/${code}`);

    if (!url) {
      throw new HttpException('URL not found', HttpStatus.NOT_FOUND);
    }

    const clickCreate: Partial<Click> = {
      userId: payload?.id,
      urlId: url.id,
    };

    await this.clickRepository.create(clickCreate);

    return url.originalUrl;
  }
}
