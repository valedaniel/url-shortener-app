import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class UrlShortDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUrl(undefined, { message: 'Invalid URL' })
  url: string;
}
