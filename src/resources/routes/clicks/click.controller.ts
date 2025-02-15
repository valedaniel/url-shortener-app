import { ClickService } from '@app/resources/routes/clicks/click.service';
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
import { Request, Response } from 'express';

@Controller({
  version: VERSION_NEUTRAL,
})
export class ClickController {
  constructor(private readonly clickService: ClickService) {}

  @Get(':code')
  @Public()
  async clicking(
    @Req() request: Request,
    @Res() response: Response,
    @Param('code') code: string,
  ) {
    const payload = request.user as Payload;

    const originalURL = await this.clickService.clicking(
      request,
      code,
      payload,
    );

    return response.status(HttpStatus.PERMANENT_REDIRECT).json(originalURL);
  }
}
