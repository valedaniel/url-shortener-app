import { UrlShortDto } from '@app/resources/routes/urls/dtos/url.short.dto';
import { UrlUpdateDto } from '@app/resources/routes/urls/dtos/url.update.dto';
import { OwnershipGuard } from '@app/resources/routes/urls/guards/ownership.guard';
import { UrlService } from '@app/resources/routes/urls/url.service';
import { Payload } from '@app/types/payload';
import { Public } from '@app/utils/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

import { Request } from 'express';

/**
 * Controller for handling URL-related operations.
 */
@Controller('api/urls')
export class UrlController {
  /**
   * Constructs a new UrlController.
   *
   * @param service - The URL service to be used by the controller.
   */
  constructor(private readonly service: UrlService) {}

  /**
   * Creates a new shortened URL.
   *
   * @param request - The HTTP request object.
   * @param body - The data transfer object containing the URL to be shortened.
   * @returns The created shortened URL.
   */
  @Post()
  @Public()
  create(@Req() request: Request, @Body() body: UrlShortDto) {
    const { url } = body;

    return this.service.create(request, url);
  }

  /**
   * Lists all shortened URLs for the authenticated user.
   *
   * @param request - The HTTP request object.
   * @returns A list of shortened URLs.
   */
  @Get()
  @ApiBearerAuth()
  list(@Req() request: Request) {
    const payload = request.user as Payload;
    return this.service.list(payload);
  }

  /**
   * Updates an existing shortened URL.
   *
   * @param id - The ID of the URL to be updated.
   * @param request - The HTTP request object.
   * @param body - The data transfer object containing the updated URL information.
   * @returns The updated shortened URL.
   */
  @Put(':id')
  @UseGuards(OwnershipGuard)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Req() request: Request,
    @Body() body: UrlUpdateDto,
  ) {
    return this.service.update(request, +id, body);
  }

  /**
   * Deletes an existing shortened URL.
   *
   * @param id - The ID of the URL to be deleted.
   * @returns A confirmation of the deletion.
   */
  @Delete(':id')
  @UseGuards(OwnershipGuard)
  @ApiBearerAuth()
  delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
