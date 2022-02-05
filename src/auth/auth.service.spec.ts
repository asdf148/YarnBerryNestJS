import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcrypt';
import { AuthService } from './auth.service';
import { CreateAuthDTO } from './dto/createAuth.dto';
import { Auth } from './entity/auth.entity';
import { AuthRepository } from './entity/auth.repository';

describe('AuthService', () => {
  let service: AuthService;
  let repository: AuthRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        AuthRepository,
        {
          provide: getModelToken(Auth.name),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          useFactory: () => {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<AuthRepository>(AuthRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('회원가입', async () => {
    const createAuth: CreateAuthDTO = new CreateAuthDTO(
      null,
      'asdf',
      'asdf@asdf.com',
      'asdfqw12',
    );

    const savedAuth: Auth = new Auth(
      null,
      null,
      'test',
      'asdf@asdf.com',
      await hash(createAuth.password, 10),
      [],
    );

    jest
      .spyOn(repository, 'save')
      .mockImplementation(() => Promise.resolve(savedAuth));

    const result = await service.signUp(createAuth);
    expect(result).toBeInstanceOf(Auth);
    expect(result.email).toBe(savedAuth.email);
    expect(result.name).toBe(savedAuth.name);
  });
});
