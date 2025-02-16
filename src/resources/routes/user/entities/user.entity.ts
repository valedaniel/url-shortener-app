import { ApiProperty } from '@nestjs/swagger';
import {
  AutoIncrement,
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  modelName: 'users',
  tableName: 'users',
  freezeTableName: true,
  paranoid: true,
})
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the user',
  })
  id: number;

  @CreatedAt
  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'The date the user was created',
  })
  createdAt: Date;

  @UpdatedAt
  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'The date the user was last updated',
  })
  updatedAt: Date;

  @DeletedAt
  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'The date the user was deleted',
  })
  deletedAt?: Date;

  @Column
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  email: string;

  @Column
  password: string;
}
