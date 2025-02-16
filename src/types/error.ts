import { ApiProperty } from '@nestjs/swagger';

export class Error {
  @ApiProperty({
    example: 409,
    description: 'The HTTP status code',
  })
  statusCode: number;

  @ApiProperty({
    example: 'User already exists.',
    description: 'A message describing the error',
  })
  message: string;
}
