import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class UrlUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUrl(undefined, { message: 'Invalid URL' })
  originalUrl: string;
}
