import { IsUrl } from 'class-validator';

export class UrlShortDto {
  @IsUrl(undefined, { message: 'Invalid URL' })
  url: string;
}
