import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { MOCK_USERS } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data for valid credentials', async () => {
      const clientNumber = MOCK_USERS[0].clientNumber;
      const user = await service.validateUser(clientNumber, 'password_1');
      expect(user).toBeDefined();
      expect(user?.clientNumber).toEqual(clientNumber);
      expect(user).not.toHaveProperty('passwordHash');
    });

    it('should return null for invalid client number', async () => {
      const user = await service.validateUser('00000000', 'password_1');
      expect(user).toBeNull();
    });

    it('should return null for invalid password', async () => {
      const clientNumber = MOCK_USERS[0].clientNumber;
      const user = await service.validateUser(clientNumber, 'wrong_password');
      expect(user).toBeNull();
    });
  });
});
