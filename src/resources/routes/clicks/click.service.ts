import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import Click from '@app/resources/routes/clicks/entities/click.entity';
import { UrlService } from '@app/resources/routes/urls/url.service';
import { Payload } from '@app/types/payload';
import { getFullDomain } from '@app/utils/getFullDomain';
import { Request } from 'express';

@Injectable()
export class ClickService {
  constructor(
    @InjectModel(Click)
    private readonly clickRepository: typeof Click,
    private readonly urlService: UrlService,
  ) {}

  async clicking(request: Request, code: string, payload?: Payload) {
    const fullDomain = getFullDomain(request);

    console.log(`${fullDomain}/${code}`);

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
