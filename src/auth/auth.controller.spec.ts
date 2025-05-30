import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { MOCK_USERS } from '../users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return user id on successful login', async () => {
      const loginDto: LoginDto = { clientNumber: MOCK_USERS[0].clientNumber, password_dont_send_to_client: 'password_1' };
      const mockUser = { id: MOCK_USERS[0].id, clientNumber: MOCK_USERS[0].clientNumber };
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);

      const result = await controller.login(loginDto);
      expect(result).toEqual({ message: 'Login successful', userId: mockUser.id });
      expect(service.validateUser).toHaveBeenCalledWith(loginDto.clientNumber, loginDto.password_dont_send_to_client);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LoginDto = { clientNumber: 'invalid', password_dont_send_to_client: 'invalid' };
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
