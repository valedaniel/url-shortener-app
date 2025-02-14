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
  id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt?: Date;

  @Column
  email: string;

  @Column
  password: string;
}
