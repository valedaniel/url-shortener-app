import { CreateUserDto } from '@app/resources/routes/user/dtos/create.user.dto';
import User from '@app/resources/routes/user/entities/user.entity';
import { UserService } from '@app/resources/routes/user/user.service';
import { Error } from '@app/types/error';
import { Public } from '@app/utils/decorators';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists.',
    type: Error,
  })
  create(@Body() user: CreateUserDto) {
    return this.service.create(user);
  }
}
