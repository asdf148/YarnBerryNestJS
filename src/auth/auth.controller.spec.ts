import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcrypt';
import { SuccessResponseDTO } from '../dto/successResponse.dto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateAuthDTO } from './dto/createAuth.dto';
import { Auth } from './entity/auth.entity';
import { LoginDTO } from './dto/login.dto';
import { MulterModule } from '@nestjs/platform-express';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  const responseMock = {
    statusCode: Number,

    status: jest.fn((httpStatusCode: number) => {
      responseMock.statusCode = httpStatusCode;
      return responseMock;
    }),
    json: jest.fn((body) => {
      responseMock.send = body;
      return responseMock;
    }),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MulterModule],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(),
            login: jest.fn(),
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

  it('회원가입 성공', async () => {
    const CreateAuth: CreateAuthDTO = new CreateAuthDTO(
      'asdf',
      'asdf@asdf.com',
      'asdfqw12',
    );

    const foundAuth: Auth = new Auth(
      null,
      'asdf',
      'asdf@asdf.com',
      await hash('asdfqw12', 10),
      [],
    );

    const signUpSuccessResponse = new SuccessResponseDTO<string>(
      'SignUp Success',
      foundAuth.email,
    );

    jest
      .spyOn(service, 'signUp')
      .mockImplementation(() => Promise.resolve(foundAuth));

    expect(await controller.signUp(null, CreateAuth, responseMock)).toBe(
      responseMock.status(HttpStatus.CREATED).json(signUpSuccessResponse),
    );
  });

  it('로그인 성공', async () => {
    const loginAuth: LoginDTO = new LoginDTO('asdf@asdf.com', 'asdfqw12');

    const loginSuccessResponse = new SuccessResponseDTO<string>(
      'Login Success',
      null,
      'token',
    );

    jest
      .spyOn(service, 'login')
      .mockImplementation(() => Promise.resolve('token'));

    const result = await controller.login(loginAuth, responseMock);
    const expectValue = responseMock
      .status(HttpStatus.OK)
      .json(loginSuccessResponse);

    expect(result).toBe(expectValue);
  });
});
