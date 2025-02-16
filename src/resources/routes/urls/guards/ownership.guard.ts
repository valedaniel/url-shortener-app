import { UrlService } from '@app/resources/routes/urls/url.service';
import { Payload } from '@app/types/payload';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class OwnershipGuard implements CanActivate {
  private readonly logger = new Logger(OwnershipGuard.name);

  constructor(private readonly urlService: UrlService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as Payload;
    const urlId = Number(request.params.id);

    const url = await this.urlService.findByIdOrThrow(urlId);

    if (url?.ownerId !== user.id) {
      this.logger.error(
        `${request.method} ${request.url} - User ${user.id} is not the owner of URL ${urlId}`,
      );
      throw new HttpException(
        'You are not the owner of this URL',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
