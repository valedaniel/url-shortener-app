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
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date;

  @Column
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  email: string;

  @Column
  @ApiProperty({
    example: 'hashedpassword',
    description: 'The hashed password of the user',
  })
  password: string;
}
