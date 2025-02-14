import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { TokenService } from '@app/resources/private/token/token.service';
import User from '@app/resources/routes/user/entities/user.entity';
import { Payload } from '@app/types/payload';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,

    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async login(login: { email: string; password: string }) {
    const { email, password } = login;

    const error = new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) throw error;

    const isValid = bcrypt.compareSync(password, user?.password);
    if (!isValid) throw error;

    const { accessToken, refreshToken } =
      this.tokenService.generateTokens(user);

    const { password: _, ...userWithoutPassword } = user.toJSON();

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(payload: Payload) {
    return this.tokenService.generateTokens(payload as User);
  }
}
