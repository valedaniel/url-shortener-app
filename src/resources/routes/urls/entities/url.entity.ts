import Click from '@app/resources/routes/clicks/entities/click.entity';
import User from '@app/resources/routes/user/entities/user.entity';
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

  @Column({ field: 'url_short' })
  urlShort: string;

  @ForeignKey(() => User)
  @Column({ field: 'owner_id' })
  ownerId?: number;

  @BelongsTo(() => User, 'ownerId')
  owner?: User;

  @HasMany(() => Click, 'urlId')
  clicks?: Click[];
}
