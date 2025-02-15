import { UrlService } from '@app/resources/routes/urls/url.service';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private readonly urlService: UrlService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const urlId = Number(request.params.id);

    const url = await this.urlService.findByIdOrThrow(urlId);

    if (url?.ownerId !== user.id) {
      throw new HttpException(
        'You are not the owner of this URL',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
