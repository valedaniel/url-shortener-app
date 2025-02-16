import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class UrlShortDto {
  @ApiProperty({
    example: 'https://example.com',
    description: 'The URL to be shortened',
  })
  @IsNotEmpty()
  @IsUrl(undefined, { message: 'Invalid URL' })
  url: string;
}
