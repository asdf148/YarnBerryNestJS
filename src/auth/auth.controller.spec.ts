import { HttpStatus } from '@nestjs/common';
import { response } from 'express';
import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcrypt';
import { SuccessResponseDTO } from '../dto/successResponse.dto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateAuthDTO } from './dto/createAuth.dto';
import { Auth } from './entity/auth.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController, AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('회원가입 성공', async () => {
    const CreateAuth: CreateAuthDTO = new CreateAuthDTO(
      null,
      'asdf',
      'asdf@asdf.com',
      'asdfqw12',
    );

    const foundAuth: Auth = new Auth(
      null,
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

    expect(await controller.signUp(CreateAuth, response)).toBe(
      response.status(HttpStatus.CREATED).json(signUpSuccessResponse),
    );
  });

  it('로그인 성공', async () => {
    const loginSuccessResponse = new SuccessResponseDTO<string>(
      'Login Success',
      'token',
    );

    jest
      .spyOn(service, 'login')
      .mockImplementation(() => Promise.resolve('token'));

    expect(await controller.login(response)).toBe(
      response.status(HttpStatus.OK).json(loginSuccessResponse),
    );
  });
});
