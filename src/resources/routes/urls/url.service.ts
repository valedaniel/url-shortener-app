import { UrlUpdateDto } from '@app/resources/routes/urls/dtos/url.update.dto';
import Url from '@app/resources/routes/urls/entities/url.entity';
import { Payload } from '@app/types/payload';
import { shortenUrl } from '@app/utils/shortenUrl';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from 'express';
import { Op, Sequelize, WhereOptions } from 'sequelize';

/**
 * Service for managing URLs.
 */
@Injectable()
export class UrlService {
  private readonly logger = new Logger(UrlService.name);

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
    let where: WhereOptions = { originalUrl };

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
  async create(request: Request, originalUrl: string) {
    this.logger.log(`Creating new shortened URL`);

    try {
      const payload = request?.user as Payload;

      await this.validateUrlDuplicated(originalUrl);

      const urlShort = shortenUrl(request, originalUrl);

      const urlCreated = await this.urlRepository.create({
        originalUrl,
        urlShort,
        ownerId: payload?.id,
      });

      this.logger.log(`URL created successfully (${urlCreated.id})`);

      return urlCreated;
    } catch (error) {
      this.logger.error('Error creating shortened URL', { error });
      throw error;
    }
  }

  /**
   * Retrieves a list of URLs associated with the given payload's owner ID.
   *
   * @param payload - The payload containing the owner ID.
   * @returns A promise that resolves to an array of URLs with their details and total click count.
   *
   * The returned URL objects include the following attributes:
   * - `id`: The unique identifier of the URL.
   * - `originalUrl`: The original URL before shortening.
   * - `urlShort`: The shortened URL.
   * - `createdAt`: The timestamp when the URL was created.
   * - `updatedAt`: The timestamp when the URL was last updated.
   * - `totalClicks`: The total number of clicks the shortened URL has received.
   *
   * The URLs are filtered by the owner ID provided in the payload and grouped by their unique identifiers.
   * The total click count is calculated using a SQL COUNT function on the associated clicks.
   */
  async list(payload: Payload) {
    const { id } = payload;

    this.logger.log(`Listing URLs for owner ${id}`);

    try {
      return this.urlRepository.findAll({
        attributes: [
          'id',
          'originalUrl',
          'urlShort',
          'ownerId',
          'createdAt',
          'updatedAt',
          [
            Sequelize.cast(
              Sequelize.fn('COUNT', Sequelize.col('clicks.id')),
              'integer',
            ),
            'totalClicks',
          ],
        ],
        where: { ownerId: id },
        include: [{ association: 'clicks', attributes: [] }],
        group: ['urls.id'],
      });
    } catch (error) {
      this.logger.error('Error listing URLs', { ownerId: id, error });
      throw error;
    }
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

    this.logger.log(`Updating URL (${id})`);

    try {
      await this.validateUrlDuplicated(originalUrl, id);

      const urlShort = shortenUrl(request, originalUrl);

      await this.urlRepository.update(
        { originalUrl, urlShort },
        { where: { id } },
      );

      return this.findByIdOrThrow(id);
    } catch (error) {
      this.logger.error('Error updating URL', { id, error });
      throw error;
    }
  }

  /**
   * Deletes a URL entry by its ID.
   *
   * @param {number} id - The ID of the URL entry to delete.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the entry was deleted, `false` otherwise.
   */
  async delete(id: number): Promise<boolean> {
    this.logger.log(`Deleting URL (${id})`);

    try {
      const rows = await this.urlRepository.destroy({
        where: { id },
        limit: 1,
      });

      return rows > 0;
    } catch (error) {
      this.logger.error('Error deleting URL', { id, error });
      throw error;
    }
  }
}
