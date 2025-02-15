import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { UrlUpdateDto } from '@app/resources/routes/urls/dtos/url.update.dto';
import Url from '@app/resources/routes/urls/entities/url.entity';
import { Payload } from '@app/types/payload';
import { shortenUrl } from '@app/utils/shortenUrl';
import { Request } from 'express';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url)
    private readonly urlRepository: typeof Url,
  ) {}

  async findByIdOrThrow(id: number) {
    const url = await this.urlRepository.findByPk(id);
    if (!url) {
      throw new HttpException('URL not found', HttpStatus.NOT_FOUND);
    }
    return url;
  }

  async findByDomain(domain: string) {
    return await this.urlRepository.findOne({
      where: { urlShort: domain },
    });
  }

  async validateUrlDuplicated(originalUrl: string) {
    const existingUrl = await this.urlRepository.findOne({
      where: { originalUrl },
    });

    if (existingUrl) {
      throw new HttpException('URL already exists', HttpStatus.CONFLICT);
    }
  }

  async create(request: Request, originalUrl: string, payload?: Payload) {
    await this.validateUrlDuplicated(originalUrl);

    const urlShort = shortenUrl(request, originalUrl);

    return this.urlRepository.create({
      originalUrl,
      urlShort,
      ownerId: payload?.id,
    });
  }

  async list(payload: Payload) {
    return this.urlRepository.findAll({
      where: { ownerId: payload.id },
    });
  }

  async update(request: Request, id: number, body: UrlUpdateDto) {
    const { originalUrl } = body;

    await this.validateUrlDuplicated(originalUrl);

    const urlShort = shortenUrl(request, originalUrl);

    return await this.urlRepository.update(
      { originalUrl, urlShort },
      { where: { id } },
    );
  }

  async delete(id: number) {
    return await this.urlRepository.destroy({
      where: { id },
      limit: 1,
    });
  }
}
