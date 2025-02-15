import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { UrlUpdateDto } from '@app/resources/routes/urls/dtos/url.update.dto';
import Url from '@app/resources/routes/urls/entities/url.entity';
import { Payload } from '@app/types/payload';
import { shortenUrl } from '@app/utils/shortenUrl';
import { Request } from 'express';
import { Op, WhereOptions } from 'sequelize';

/**
 * Service for managing URLs.
 */
@Injectable()
export class UrlService {
  /**
   * Constructs a new UrlService.
   * @param urlRepository - The URL repository.
   */
  constructor(
    @InjectModel(Url)
    private readonly urlRepository: typeof Url,
  ) {}

  /**
   * Finds a URL by its ID or throws an exception if not found.
   * @param id - The ID of the URL.
   * @returns The URL if found.
   * @throws HttpException if the URL is not found.
   */
  async findByIdOrThrow(id: number) {
    const url = await this.urlRepository.findByPk(id);
    if (!url) {
      throw new HttpException('URL not found', HttpStatus.NOT_FOUND);
    }
    return url;
  }

  /**
   * Finds a URL by its shortened domain.
   * @param domain - The shortened domain of the URL.
   * @returns The URL if found.
   */
  async findByDomain(domain: string) {
    return await this.urlRepository.findOne({
      where: { urlShort: domain },
    });
  }

  /**
   * Validates if a URL is duplicated.
   * @param originalUrl - The original URL to check.
   * @throws HttpException if the URL already exists.
   */
  async validateUrlDuplicated(originalUrl: string, id?: number) {
    let where: WhereOptions<any> = { originalUrl };

    if (id) {
      where = { ...where, id: { [Op.ne]: id } };
    }

    const existingUrl = await this.urlRepository.findOne({
      where,
    });

    if (existingUrl) {
      throw new HttpException('URL already exists', HttpStatus.CONFLICT);
    }
  }

  /**
   * Creates a new shortened URL.
   * @param request - The HTTP request object.
   * @param originalUrl - The original URL to shorten.
   * @param payload - Optional payload containing additional data.
   * @returns The created URL.
   * @throws HttpException if the URL already exists.
   */
  async create(request: Request, originalUrl: string, payload?: Payload) {
    await this.validateUrlDuplicated(originalUrl);

    const urlShort = shortenUrl(request, originalUrl);

    return this.urlRepository.create({
      originalUrl,
      urlShort,
      ownerId: payload?.id,
    });
  }

  /**
   * Lists all URLs for a given owner.
   * @param payload - The payload containing the owner's ID.
   * @returns A list of URLs.
   */
  async list(payload: Payload) {
    return this.urlRepository.findAll({
      where: { ownerId: payload.id },
    });
  }

  /**
   * Updates an existing URL.
   * @param request - The HTTP request object.
   * @param id - The ID of the URL to update.
   * @param body - The data to update the URL with.
   * @returns The updated URL.
   * @throws HttpException if the URL already exists.
   */
  async update(request: Request, id: number, body: UrlUpdateDto) {
    const { originalUrl } = body;

    await this.validateUrlDuplicated(originalUrl, id);

    const urlShort = shortenUrl(request, originalUrl);

    const rows = await this.urlRepository.update(
      { originalUrl, urlShort },
      { where: { id } },
    );

    return rows[0] > 0;
  }

  /**
   * Deletes a URL entry by its ID.
   *
   * @param {number} id - The ID of the URL entry to delete.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the entry was deleted, `false` otherwise.
   */
  async delete(id: number): Promise<boolean> {
    const rows = await this.urlRepository.destroy({
      where: { id },
      limit: 1,
    });

    return rows > 0;
  }
}
