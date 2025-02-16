import { ApiProperty } from '@nestjs/swagger';

export class Error {
  @ApiProperty({
    example: 0,
    description: 'The HTTP status code',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Error message.',
    description: 'A message describing the error',
  })
  message: string;
}
