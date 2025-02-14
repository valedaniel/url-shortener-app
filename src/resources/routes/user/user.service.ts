import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateUserDto } from '@app/resources/routes/user/dtos/create.user.dto';
import { generateHash } from '@app/utils/generateHash/generateHash';
import User from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async create(user: CreateUserDto) {
    const userExists = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = generateHash(user.password);

    return this.userRepository.create({
      ...user,
      password: hashedPassword,
    });
  }
}
