import { CreateUserDto } from '@app/resources/routes/user/dtos/create.user.dto';
import { UserService } from '@app/resources/routes/user/user.service';
import { Public } from '@app/utils/decorators';
import { Body, Controller, Post } from '@nestjs/common';

/**
 * Controller for handling user-related operations.
 */
@Controller('api/users')
export class UserController {
  /**
   * Creates an instance of UserController.
   * @param service - The user service to handle user operations.
   */
  constructor(private readonly service: UserService) {}

  /**
   * Creates a new user.
   * @param user - The data transfer object containing user details.
   * @returns The created user.
   */
  @Post()
  @Public()
  create(@Body() user: CreateUserDto) {
    return this.service.create(user);
  }
}
