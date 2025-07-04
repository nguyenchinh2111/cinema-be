import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login successfully and return access token', async () => {
      const loginResponse = {
        access_token: 'jwt-token-here',
        user: mockUser,
      };
      const mockRequest = { user: mockUser };

      mockAuthService.login.mockResolvedValue(loginResponse);

      const result = await controller.login(mockRequest);

      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(loginResponse);
    });

    it('should handle authentication failure', async () => {
      const mockRequest = { user: null };
      const error = new Error('Authentication failed');

      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login(mockRequest)).rejects.toThrow(
        'Authentication failed',
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(null);
    });

    it('should pass user object from request to auth service', async () => {
      const loginResponse = { access_token: 'token', user: mockUser };
      const mockRequest = { user: mockUser };

      mockAuthService.login.mockResolvedValue(loginResponse);

      await controller.login(mockRequest);

      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('getProfile', () => {
    it('should return user profile from request', () => {
      const mockRequest = { user: mockUser };

      const result = controller.getProfile(mockRequest);

      expect(result).toEqual(mockUser);
    });

    it('should return user profile with all fields', () => {
      const detailedUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        createdAt: new Date(),
      };
      const mockRequest = { user: detailedUser };

      const result = controller.getProfile(mockRequest);

      expect(result).toEqual(detailedUser);
      expect(result.id).toBe(1);
      expect(result.username).toBe('testuser');
      expect(result.email).toBe('test@example.com');
    });

    it('should handle empty user in request', () => {
      const mockRequest = { user: null };

      const result = controller.getProfile(mockRequest);

      expect(result).toBeNull();
    });
  });
});
