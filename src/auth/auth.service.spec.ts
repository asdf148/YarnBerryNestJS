import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './entity/auth.repository';

describe('AuthService', () => {
  let service: AuthService;
  let repository: AuthRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<AuthRepository>(AuthRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('회원가입', () => {
    const auth = {
      name: 'test',
      email: 'asdf@asdf.com',
      password: 'asdfqw12',
    };
    const result = service.signUp(auth);
    expect(result).toBe(true);
  })
});
