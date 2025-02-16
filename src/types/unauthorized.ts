import { ApiProperty } from '@nestjs/swagger';

export class Unauthorized extends Error {
  @ApiProperty({
    example: 401,
    description: 'The HTTP status code',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Unauthorized',
    description: 'A message describing the error',
  })
  message: string;
}
