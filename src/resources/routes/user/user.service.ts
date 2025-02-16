import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateUserDto } from '@app/resources/routes/user/dtos/create.user.dto';
import { generateHash } from '@app/utils/generateHash';
import User from './entities/user.entity';

/**
 * Service responsible for handling user-related operations.
 */
@Injectable()
export class UserService {
  /**
   * Constructs a new instance of the UserService.
   *
   * @param userRepository - The repository for accessing user data.
   */
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  private readonly logger = new Logger(UserService.name);

  /**
   * Creates a new user.
   *
   * @param user - The data transfer object containing user details.
   * @returns The created user.
   * @throws {HttpException} If a user with the given email already exists.
   */
  async create(user: CreateUserDto) {
    try {
      const userExists = await this.userRepository.findOne({
        where: { email: user.email },
      });

      if (userExists) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      const hashedPassword = generateHash(user.password);

      const userCreated = await this.userRepository.create({
        ...user,
        password: hashedPassword,
      });

      const { password: _, ...userWithoutPassword } = userCreated.toJSON();

      this.logger.log(`User (${userCreated.id}) created successfully`);

      return userWithoutPassword;
    } catch (error) {
      this.logger.error('Error creating user', { error });
      throw error;
    }
  }
}
