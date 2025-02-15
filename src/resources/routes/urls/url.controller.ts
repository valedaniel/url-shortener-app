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
import { Request } from 'express';

@Controller('api/urls')
export class UrlController {
  constructor(private readonly service: UrlService) {}

  @Post()
  @Public()
  create(@Req() request: Request, @Body() body: UrlShortDto) {
    const payload = request.user as Payload;
    const { url } = body;

    return this.service.create(request, url, payload);
  }

  @Get()
  list(@Req() request: Request) {
    const payload = request.user as Payload;
    return this.service.list(payload);
  }

  @Put(':id')
  @UseGuards(OwnershipGuard)
  update(
    @Param('id') id: string,
    @Req() request: Request,
    @Body() body: UrlUpdateDto,
  ) {
    return this.service.update(request, +id, body);
  }

  @Delete(':id')
  @UseGuards(OwnershipGuard)
  delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
