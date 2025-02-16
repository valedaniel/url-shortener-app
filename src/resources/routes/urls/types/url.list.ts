import Url from '@app/resources/routes/urls/entities/url.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UrlList extends Url {
  @ApiProperty({ example: 12, description: 'Total clicks on the url' })
  totalClicks: number;
}
