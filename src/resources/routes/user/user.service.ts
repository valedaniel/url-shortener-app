import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { generateHash } from '@app/utils/generateHash/generateHash';
import User from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async create(user: User) {
    const userExists = await this.userRepository.findOne({
      where: { email: user?.email },
    });

    if (userExists) {
      throw new Error('User already exists');
    }

    const userCreated = await this.userRepository.create({
      ...user,
      password: generateHash(user?.password),
    });

    return userCreated;
  }
}
