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
import { multerDiskOptions } from '../global/multer.options';
import { CustomController } from 'src/global/customController';

@Controller('auth')
@ApiTags('계정 API')
export class AuthController extends CustomController {
  constructor(private readonly authService: AuthService) {
    super();
  }

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

      return this.ReturnSuccessResponse<string>(
        res,
        'SignUp Success',
        null,
        savedAuth.email,
      );
    } catch (e) {
      return this.returnBadRequestResponseWithJSON(
        res,
        'SignUp Fail',
        e.message,
      );
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

      return this.ReturnSuccessResponse<string>(
        res,
        'Login Success',
        null,
        token,
      );
    } catch (e) {
      return this.returnBadRequestResponseWithJSON(
        res,
        'Login Fail',
        e.message,
      );
    }
  }

  ReturnSuccessResponse<T>(
    res: Response,
    state?: string,
    message?: string,
    data?: T,
  ): Response<any, Record<string, any>> {
    const successResponse: SuccessResponseDTO<T> = new SuccessResponseDTO<T>(
      state ?? null,
      message ?? null,
      data ?? null,
    );

    return res.status(HttpStatus.CREATED).json(successResponse);
  }
}
