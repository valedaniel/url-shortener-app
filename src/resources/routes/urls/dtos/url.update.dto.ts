import { IsUrl } from 'class-validator';

export class UrlUpdateDto {
  @IsUrl(undefined, { message: 'Invalid URL' })
  originalUrl: string;
}
