import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { SignUpFailError } from '../dto/error/signUpFailError';
import { LoginFailError } from '../dto/error/loginFailError';
import { CreateAuthDTO } from './dto/createAuth.dto';
import { LoginDTO } from './dto/login.dto';
import { Auth } from './entity/auth.entity';
import { AuthRepository } from './entity/auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  // 회원가입
  async signUp(
    createAuth: CreateAuthDTO,
    img: Express.Multer.File,
  ): Promise<Auth> {
    this.createAuthValidation(createAuth);

    const savedAuth: Auth = new Auth(
      null,
      img.filename ?? null,
      createAuth.name,
      createAuth.email,
      await hash(createAuth.password, 10),
      null,
    );

    return await this.authRepository.save(savedAuth);
  }

  createAuthValidation(createAuth: CreateAuthDTO): void {
    try {
      this.isNameNull(createAuth.name);
      this.isEmailNull(createAuth.email);
      this.isPasswordNull(createAuth.password);
    } catch (e) {
      throw new SignUpFailError(e);
    }

    return;
  }

  isNameNull(name: string): void {
    if (name === null) {
      throw 'name';
    }
    return;
  }

  isEmailNull(email: string): void {
    if (email === null) {
      throw 'email';
    }
    return;
  }

  isPasswordNull(password: string): void {
    if (password === null) {
      throw 'password';
    }
    return;
  }

  // 로그인
  async login(loginDTO: LoginDTO): Promise<string> {
    const foundAuth: Auth = await this.authRepository.findByEmail(
      loginDTO.email,
    );

    if (await this.isExistAndIsPasswordMatch(foundAuth, loginDTO)) {
      return this.jwtService.sign(
        {
          email: foundAuth.email,
        },
        {
          expiresIn: '1d',
        },
      );
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
