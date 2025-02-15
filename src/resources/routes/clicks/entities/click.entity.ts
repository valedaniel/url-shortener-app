import Url from '@app/resources/routes/urls/entities/url.entity';
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
  modelName: 'clicks',
  tableName: 'clicks',
  freezeTableName: true,
  paranoid: true,
})
export default class Click extends Model {
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

  @ForeignKey(() => Url)
  @Column({ field: 'url_id' })
  urlId: number;

  @BelongsTo(() => Url, 'urlId')
  url: Url;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId?: number;

  @BelongsTo(() => User, 'userId')
  user?: User;
}
