import User from '@app/resources/routes/user/entities/user.entity';
import { UserService } from '@app/resources/routes/user/user.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  create(@Body() user: User) {
    return this.service.create(user);
  }
}
