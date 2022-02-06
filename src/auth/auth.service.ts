import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
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
    const foundAuth = await this.authRepository.findByEmail(loginDTO.email);

    if (foundAuth && (await compare(loginDTO.password, foundAuth.password))) {
      return this.jwtService.sign(new TokenPayloadDTO(foundAuth.email));
    } else {
      throw new LoginFailError('로그인 실패');
    }
  }
}
