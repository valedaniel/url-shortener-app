import { BadRequestException, Injectable } from '@nestjs/common';

import { Model, Repository } from 'sequelize-typescript';
import {
  Attributes,
  CountOptions,
  CreateOptions,
  CreationAttributes,
  DestroyOptions,
  FindAndCountOptions,
  FindOptions,
  UpdateOptions,
  WhereOptions,
} from 'sequelize/types';

@Injectable()
export abstract class CrudService<T extends Model<T>> {
  constructor(private readonly repository: Repository<T>) {}

  async create(data: T, options?: CreateOptions<Attributes<T>>) {
    const creationAttributes: CreationAttributes<T> = { ...data } as any;
    return this.repository.create(creationAttributes, options);
  }

  async update(id: number, data: T, options?: UpdateOptions<Attributes<T>>) {
    if (data['deletedAt']) return this.delete(id);

    return this.repository.update(data, {
      ...(options || {}),
      where: { ...(options?.where || {}), id },
    } as UpdateOptions<Attributes<T>>);
  }

  async findAll(options?: FindOptions<Attributes<T>>) {
    return this.repository.findAll(options);
  }

  async findAndCountAll(
    options?: Omit<FindAndCountOptions<Attributes<T>>, 'group'>,
  ) {
    return this.repository.findAndCountAll(options);
  }

  async count(options?: Omit<CountOptions<Attributes<T>>, 'group'>) {
    return this.repository.count(options);
  }

  async findOne(options: FindOptions<Attributes<T>>) {
    return this.repository.findOne(options);
  }

  async findByPk(
    id: number,
    options?: Omit<FindOptions<Attributes<T>>, 'where'>,
  ) {
    return this.repository.findByPk(id, options);
  }

  async delete(id: number, options?: DestroyOptions<Attributes<T>>) {
    const rowsDestroyed = await this.repository.destroy({
      ...(options || {}),
      where: { id } as WhereOptions<Attributes<T>>,
      limit: 1,
    });

    if (!rowsDestroyed) throw new BadRequestException();

    return rowsDestroyed;
  }
}
