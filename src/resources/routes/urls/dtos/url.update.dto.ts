import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class UrlUpdateDto {
  @ApiProperty({
    example: 'https://example.com',
    description: 'The updated original URL',
  })
  @IsNotEmpty()
  @IsUrl(undefined, { message: 'Invalid URL' })
  originalUrl: string;
}
