import { ClickService } from '@app/resources/routes/clicks/click.service';
import { Error } from '@app/types/error';
import { Payload } from '@app/types/payload';
import { Public } from '@app/utils/decorators';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Req,
  Res,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';

/**
 * Controller for handling click events.
 *
 * @version VERSION_NEUTRAL
 */
@Controller({
  version: VERSION_NEUTRAL,
})
export class ClickController {
  /**
   * Creates an instance of ClickController.
   *
   * @param clickService - The service used to handle click events.
   */
  constructor(private readonly clickService: ClickService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Welcome message' })
  @ApiResponse({ status: 200, description: 'Welcome message' })
  async welcome() {
    return 'Welcome to the URL Shortener API - Developed by github.com/valedaniel';
  }

  /**
   * Handles the click event.
   *
   * @param request - The incoming request object.
   * @param response - The outgoing response object.
   * @param code - The code associated with the URL to be redirected.
   * @returns The original URL associated with the given code.
   */
  @Get(':code')
  @Public()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Handle click event' })
  @ApiResponse({ status: 307, description: 'Redirect to the original URL' })
  @ApiResponse({
    status: 404,
    description: 'URL not found',
    type: Error,
  })
  async clicking(
    @Req() request: Request,
    @Res() response: Response,
    @Param('code') code: string,
  ) {
    const payload = request?.user as Payload;

    const originalURL = await this.clickService.clicking(
      request,
      code,
      payload,
    );

    return response.redirect(HttpStatus.TEMPORARY_REDIRECT, originalURL);
  }
}
