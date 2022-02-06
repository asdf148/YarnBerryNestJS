import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { compare, hash } from 'bcrypt';
import { SuccessResponseDTO } from 'src/dto/successResponse.dto';
import { AuthService } from './auth.service';
import { CreateAuthDTO } from './dto/createAuth.dto';
import { LoginDTO } from './dto/login.dto';
import { Auth } from './entity/auth.entity';
import { AuthRepository } from './entity/auth.repository';

describe('AuthService', async () => {
  let service: AuthService;
  let repository: AuthRepository;

  const createAuth: CreateAuthDTO = new CreateAuthDTO(
    null,
    'asdf',
    'asdf@asdf.com',
    'asdfqw12',
  );

  const savedAuth: Auth = new Auth(
    null,
    null,
    'asdf',
    'asdf@asdf.com',
    await hash(createAuth.password, 10),
    [],
  );

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
    jest
      .spyOn(repository, 'save')
      .mockImplementation(() => Promise.resolve(savedAuth));

    const result = await service.signUp(createAuth);

    expect(result).toBeInstanceOf(Auth);
    expect(result.email).toBe(createAuth.email);
    expect(result.name).toBe(createAuth.name);
    expect(await compare(createAuth.password, result.password)).toBe(true);
  });

  it('로그인', async () => {
    const loginDTO: LoginDTO = new LoginDTO('asdf@asdf.com', 'asdfqw12');

    jest
      .spyOn(repository, 'findByEmail')
      .mockImplementation(() => Promise.resolve(savedAuth));

    const result = await service.login(loginDTO);

    expect(result).toBeInstanceOf(SuccessResponseDTO);
    expect(result.data).toBeInstanceOf(String);
  });
});
