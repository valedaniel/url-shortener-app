import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import Url from '@app/resources/routes/urls/entities/url';
import { Payload } from '@app/types/payload';
import { shortenUrl } from '@app/utils/shortenUrl';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url)
    private readonly urlRepository: typeof Url,
  ) {}

  async short(originalUrl: string, payload?: Payload) {
    const existingUrl = await this.urlRepository.findOne({
      where: { originalUrl },
    });

    if (existingUrl) {
      throw new HttpException('URL already exists', HttpStatus.CONFLICT);
    }

    const urlShort = shortenUrl(originalUrl);

    return this.urlRepository.create({
      originalUrl,
      shortUrl: urlShort,
      ownerId: payload?.id,
    });
  }

  async list(payload: Payload) {
    return this.urlRepository.findAll({
      where: { ownerId: payload.id },
    });
  }
}
