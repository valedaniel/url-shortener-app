/* eslint-disable @typescript-eslint/unbound-method */
import User from '@app/resources/routes/user/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dtos/create.user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call UserService.create with the correct parameters', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@email.com',
        password: 'testpass',
      };
      await controller.create(createUserDto);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should return the result of UserService.create', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@email.com',
        password: 'testpass',
      };
      const result = { id: 1, ...createUserDto };
      jest.spyOn(service, 'create').mockResolvedValue(result as User);
      expect(await controller.create(createUserDto)).toBe(result);
    });
  });
});
