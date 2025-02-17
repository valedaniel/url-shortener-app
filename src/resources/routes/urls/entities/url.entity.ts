import Click from '@app/resources/routes/clicks/entities/click.entity';
import User from '@app/resources/routes/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  modelName: 'urls',
  tableName: 'urls',
  freezeTableName: true,
  paranoid: true,
})
export default class Url extends Model {
  @ApiProperty({ example: 1, description: 'The unique identifier of the URL' })
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ApiProperty({
    example: '2025-02-16T12:34:56.789Z',
    description: 'The date and time when the URL was created',
  })
  @CreatedAt
  createdAt: Date;

  @ApiProperty({
    example: '2025-02-16T12:34:56.789Z',
    description: 'The date and time when the URL was last updated',
  })
  @UpdatedAt
  updatedAt: Date;

  @ApiProperty({
    example: '2025-02-16T12:34:56.789Z',
    description: 'The date and time when the URL was deleted',
    required: false,
  })
  @DeletedAt
  deletedAt?: Date;

  @ApiProperty({
    example: 'https://example.com',
    description: 'The original URL',
  })
  @Column({ field: 'original_url' })
  originalUrl: string;

  @ApiProperty({
    example: 'http://localhost:3000/aZbKq7',
    description: 'The shortened URL',
  })
  @Column({ field: 'url_short' })
  urlShort: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the owner of the URL',
    required: false,
  })
  @ForeignKey(() => User)
  @Column({ field: 'owner_id' })
  ownerId?: number;

  @BelongsTo(() => User, 'ownerId')
  owner?: User;

  @HasMany(() => Click, 'urlId')
  clicks?: Click[];
}
