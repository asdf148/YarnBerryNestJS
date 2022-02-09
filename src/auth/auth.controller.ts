import { Body, Controller, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { SuccessResponseDTO } from '../dto/successResponse.dto';
import { AuthService } from './auth.service';
import { CreateAuthDTO } from './dto/createAuth.dto';
import { LoginDTO } from './dto/login.dto';
import { Auth } from './entity/auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async signUp(
    @Body() createAuth: CreateAuthDTO,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const savedAuth: Auth = await this.authService.signUp(createAuth);
      const signUpSuccessResponse: SuccessResponseDTO<string> =
        new SuccessResponseDTO<string>('SignUp Success', savedAuth.email);

      return res.status(HttpStatus.CREATED).json(signUpSuccessResponse);
    } catch (e) {
      const signUpFailResponse: SuccessResponseDTO<string> =
        new SuccessResponseDTO<string>('SignUp Fail', e.message);

      return res.status(HttpStatus.BAD_REQUEST).json(signUpFailResponse);
    }
  }

  async login(
    @Body() loginDTO: LoginDTO,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const token: string = await this.authService.login(loginDTO);
      const loginSuccessResponse: SuccessResponseDTO<string> =
        new SuccessResponseDTO<string>('Login Success', token);

      return res.status(HttpStatus.CREATED).json(loginSuccessResponse);
    } catch (e) {
      const loginFailResponse: SuccessResponseDTO<string> =
        new SuccessResponseDTO<string>('Login Fail', e.message);

      return res.status(HttpStatus.BAD_REQUEST).json(loginFailResponse);
    }
  }
}
