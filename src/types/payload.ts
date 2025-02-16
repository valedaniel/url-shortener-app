import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'sequelize-typescript';

export class Payload {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the user',
  })
  id: number;

  @Column
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    example: 1617181723,
    description: 'The issued at timestamp',
  })
  iat?: number;

  @ApiProperty({
    example: 1617185323,
    description: 'The expiration timestamp',
  })
  exp?: number;
}
