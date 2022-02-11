import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { SuccessResponseDTO } from '../dto/successResponse.dto';
import { AuthService } from './auth.service';
import { CreateAuthDTO } from './dto/createAuth.dto';
import { LoginDTO } from './dto/login.dto';
import { Auth } from './entity/auth.entity';
import { FailResponseDTO } from '../dto/failResponse.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerDiskOptions } from 'src/global/multer.options';

@Controller('auth')
@ApiTags('계정 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  @ApiOperation({ summary: '회원가입 API', description: '유저 생성' })
  @ApiCreatedResponse({ description: '유저 생성', type: SuccessResponseDTO })
  @ApiBadRequestResponse({
    description: '유저 생성 실패',
    type: FailResponseDTO,
  })
  @UseInterceptors(FileInterceptor('file', multerDiskOptions))
  async signUp(
    @UploadedFile() img: Express.Multer.File,
    @Body() createAuth: CreateAuthDTO,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const savedAuth: Auth = await this.authService.signUp(createAuth, img);
      const signUpSuccessResponse: SuccessResponseDTO<string> =
        new SuccessResponseDTO<string>('SignUp Success', null, savedAuth.email);

      return res.status(HttpStatus.CREATED).json(signUpSuccessResponse);
    } catch (e) {
      const signUpFailResponse: SuccessResponseDTO<string> =
        new SuccessResponseDTO<string>('SignUp Fail', e.message);

      return res.status(HttpStatus.BAD_REQUEST).json(signUpFailResponse);
    }
  }

  @Post('login')
  @ApiOperation({ summary: '로그인 API', description: '토큰 발급' })
  @ApiCreatedResponse({ description: '토큰 발급', type: SuccessResponseDTO })
  @ApiBadRequestResponse({ description: '토큰 실패', type: FailResponseDTO })
  async login(
    @Body() loginDTO: LoginDTO,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const token: string = await this.authService.login(loginDTO);
      const loginSuccessResponse: SuccessResponseDTO<string> =
        new SuccessResponseDTO<string>('Login Success', null, token);

      return res.status(HttpStatus.CREATED).json(loginSuccessResponse);
    } catch (e) {
      const loginFailResponse: SuccessResponseDTO<string> =
        new SuccessResponseDTO<string>('Login Fail', e.message);

      return res.status(HttpStatus.BAD_REQUEST).json(loginFailResponse);
    }
  }
}
