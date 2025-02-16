import { FindOneParams } from '@app/resources/routes/urls/dtos/find.one.dto';
import { UrlShortDto } from '@app/resources/routes/urls/dtos/url.short.dto';
import { UrlUpdateDto } from '@app/resources/routes/urls/dtos/url.update.dto';
import { OwnershipGuard } from '@app/resources/routes/urls/guards/ownership.guard';
import { UrlList } from '@app/resources/routes/urls/types/url.list';
import { UrlService } from '@app/resources/routes/urls/url.service';
import { Error } from '@app/types/error';
import { Payload } from '@app/types/payload';
import { Unauthorized } from '@app/types/unauthorized';
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import Url from './entities/url.entity';

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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new shortened URL' })
  @ApiBody({ type: UrlShortDto })
  @ApiResponse({
    status: 201,
    description: 'The URL has been successfully shortened.',
    type: Url,
  })
  @ApiResponse({
    status: 409,
    description: 'URL already exists.',
    type: Error,
  })
  create(@Req() request: Request, @Body() body: UrlShortDto) {
    const { url } = body;
    return this.service.create(request, url);
  }

  /**
   * Lists all shortened URLs for the authenticated user.
   *
   * @param request - The HTTP request object.
   * @returns A list of shortened URLs with total clicks.
   */
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List all shortened URLs for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of shortened URLs retrieved successfully.',
    type: [UrlList],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    type: Unauthorized,
  })
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
  @ApiOperation({ summary: 'Update an existing shortened URL' })
  @ApiBody({ type: UrlUpdateDto })
  @ApiResponse({
    status: 200,
    description: 'The URL has been successfully updated.',
    type: Url,
  })
  @ApiResponse({
    status: 409,
    description: 'URL already exists.',
    type: Error,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    type: Unauthorized,
  })
  update(
    @Param() params: FindOneParams,
    @Req() request: Request,
    @Body() body: UrlUpdateDto,
  ) {
    const { id } = params;
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
  @ApiOperation({ summary: 'Delete an existing shortened URL' })
  @ApiResponse({
    status: 200,
    description: 'The URL has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'URL not found.',
    type: Error,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    type: Unauthorized,
  })
  delete(@Param() params: FindOneParams) {
    const { id } = params;
    return this.service.delete(+id);
  }
}
