import { UrlShortDto } from '@app/resources/routes/urls/dtos/url.short.dto';
import { UrlService } from '@app/resources/routes/urls/url.service';
import { Payload } from '@app/types/payload';
import { Public } from '@app/utils/decorators';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('urls')
export class UrlController {
  constructor(private readonly service: UrlService) {}

  @Post('shorten')
  @Public()
  create(@Req() request: Request, @Body() body: UrlShortDto) {
    const payload = request.user as Payload;
    const { url } = body;

    return this.service.short(url, payload);
  }

  @Get('list')
  list(@Req() request: Request) {
    const payload = request.user as Payload;
    return this.service.list(payload);
  }
}
