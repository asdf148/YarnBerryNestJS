import { JwtModule, JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { compare, hash } from 'bcrypt';
import { AuthService } from './auth.service';
import { CreateAuthDTO } from './dto/createAuth.dto';
import { LoginDTO } from './dto/login.dto';
import { Auth } from './entity/auth.entity';
import { AuthRepository } from './entity/auth.repository';

describe('AuthService', () => {
  let service: AuthService;
  let repository: AuthRepository;
  let jwtService: JwtService;
  let createAuth: CreateAuthDTO;
  let savedAuth: Auth;

  beforeAll(async () => {
    const initSavedAuth: Auth = new Auth(
      null,
      null,
      'asdf',
      'asdf@asdf.com',
      await hash('asdfqw12', 10),
      [],
    );

    savedAuth = initSavedAuth;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET_KEY,
          signOptions: { issuer: 'MyServer' },
        }),
      ],
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

    const initCreateAuth: CreateAuthDTO = new CreateAuthDTO(
      null,
      'asdf',
      'asdf@asdf.com',
      'asdfqw12',
    );

    createAuth = initCreateAuth;
    service = module.get<AuthService>(AuthService);
    repository = module.get<AuthRepository>(AuthRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('회원가입 성공', async () => {
    jest
      .spyOn(repository, 'save')
      .mockImplementation(() => Promise.resolve(savedAuth));

    const result = await service.signUp(createAuth);

    expect(result).toBeInstanceOf(Auth);
    expect(result.email).toBe(createAuth.email);
    expect(result.name).toBe(createAuth.name);
    expect(await compare(createAuth.password, result.password)).toBe(true);
  });

  it('회원가입 실패 (이름 미입력)', async () => {
    createAuth.name = null;

    jest
      .spyOn(repository, 'save')
      .mockImplementation(() => Promise.resolve(savedAuth));

    const result = await service.signUp(createAuth);

    expect(result).toThrowError('SignUpFailed name is invalid');
  });

  it('회원가입 실패 (이메일 미입력)', async () => {
    createAuth.email = null;

    jest
      .spyOn(repository, 'save')
      .mockImplementation(() => Promise.resolve(savedAuth));

    const result = await service.signUp(createAuth);

    expect(result).toThrowError('SignUpFailed email is invalid');
  });

  it('회원가입 실패 (비밀번호 미입력)', async () => {
    createAuth.password = null;

    jest
      .spyOn(repository, 'save')
      .mockImplementation(() => Promise.resolve(savedAuth));

    const result = await service.signUp(createAuth);

    expect(result).toThrowError('SignUpFailed password is invalid');
  });

  it('로그인 성공', async () => {
    const loginDTO: LoginDTO = new LoginDTO('asdf@asdf.com', 'asdfqw12');

    jest
      .spyOn(repository, 'findByEmail')
      .mockImplementation(() => Promise.resolve(savedAuth));

    jest.spyOn(jwtService, 'sign').mockImplementation(() => 'token');

    const result = await service.login(loginDTO);

    expect(result).toBe('token');
  });

  it('로그인 실패 (비밀번호 불일치)', async () => {
    const loginDTO: LoginDTO = new LoginDTO('asdf@asdf.com', 'qweras12');

    jest
      .spyOn(repository, 'findByEmail')
      .mockImplementation(() => Promise.resolve(savedAuth));

    const result = await service.login(loginDTO);

    expect(result).toThrowError('로그인 실패');
  });

  it('로그인 실패 (존재하지 않는 이메일)', async () => {
    const loginDTO: LoginDTO = new LoginDTO('qwer@qwer.com', 'asdfqw12');

    jest
      .spyOn(repository, 'findByEmail')
      .mockImplementation(() => Promise.resolve(null));

    const result = await service.login(loginDTO);

    expect(result).rejects.toThrow('로그인 실패');
  });
});
