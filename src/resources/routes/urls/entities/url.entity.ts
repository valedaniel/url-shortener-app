import User from '@app/resources/routes/user/entities/user.entity';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
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
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date;

  @Column({ field: 'original_url' })
  originalUrl: string;

  @Column({ field: 'short_url' })
  shortUrl: string;

  @Column({ field: 'total_clicks' })
  totalClicks: number;

  @ForeignKey(() => User)
  @Column({ field: 'owner_id' })
  ownerId: number;

  @BelongsTo(() => User, 'ownerId')
  owner: User;
}
