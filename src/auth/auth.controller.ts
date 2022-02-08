import { Body, Controller, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { SuccessResponseDTO } from '../dto/successResponse.dto';
import { AuthService } from './auth.service';
import { CreateAuthDTO } from './dto/createAuth.dto';
import { Auth } from './entity/auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async signUp(
    @Body() createAuth: CreateAuthDTO,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    const savedAuth: Auth = await this.authService.signUp(createAuth);
    const signUpSuccessResponse: SuccessResponseDTO<string> =
      new SuccessResponseDTO<string>('SignUp Success', savedAuth.email);

    return res.status(HttpStatus.CREATED).json(signUpSuccessResponse);
  }
}
