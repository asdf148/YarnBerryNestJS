import { Test, TestingModule } from '@nestjs/testing';
import { hash } from 'bcrypt';
import { SuccessResponseDTO } from 'src/dto/successResponse.dto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
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

    expect(await controller.signUp(signUpSuccessResponse)).toBe(
      signUpSuccessResponse,
    );
  });
});
