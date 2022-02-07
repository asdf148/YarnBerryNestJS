import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { CustomError } from '../dto/error/customError';
import { LoginFailError } from '../dto/error/loginFailError';
import { CreateAuthDTO } from './dto/createAuth.dto';
import { LoginDTO } from './dto/login.dto';
import { TokenPayloadDTO } from './dto/tokenPayload.dto';
import { Auth } from './entity/auth.entity';
import { AuthRepository } from './entity/auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  // 회원가입
  async signUp(createAuth: CreateAuthDTO): Promise<Auth> {
    const savedAuth: Auth = new Auth(
      null,
      null,
      createAuth.name,
      createAuth.email,
      await hash(createAuth.password, 10),
      [],
    );

    return await this.authRepository.save(savedAuth);
  }

  // 로그인
  async login(loginDTO: LoginDTO): Promise<string> {
    const foundAuth: Auth = await this.authRepository.findByEmail(
      loginDTO.email,
    );

    if (await this.isExistAndIsPasswordMatch(foundAuth, loginDTO)) {
      return this.jwtService.sign(new TokenPayloadDTO(foundAuth.email));
    } else {
      throw new LoginFailError('로그인 실패');
    }
  }

  // 찾은 계정이 존재하는지, 비밀번호가 일치하는지 확인
  async isExistAndIsPasswordMatch(
    foundAuth: Auth,
    loginDTO: LoginDTO,
  ): Promise<boolean> {
    return foundAuth && (await compare(loginDTO.password, foundAuth.password));
  }
}
