import { generateHash } from '@app/utils/generateHash/generateHash';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import User from './entities/user.entity';
import { UserService } from './user.service';

jest.mock('@app/utils/generateHash/generateHash');

describe('UserService', () => {
  let service: UserService;
  let userRepository: typeof User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<typeof User>(getModelToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if user already exists', async () => {
      const user = { email: 'test@example.com', password: 'password' } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      await expect(service.create(user)).rejects.toThrow('User already exists');
    });

    it('should create a new user if user does not exist', async () => {
      const user = { email: 'test@example.com', password: 'password' } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockResolvedValue(user);
      (generateHash as jest.Mock).mockReturnValue('hashedPassword');

      const result = await service.create(user);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: user.email },
      });
      expect(generateHash).toHaveBeenCalledWith(user.password);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...user,
        password: 'hashedPassword',
      });
      expect(result).toEqual(user);
    });
  });
});
