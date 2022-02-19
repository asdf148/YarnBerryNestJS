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

    const savedAuth: Auth = await this.createAuthToAuth(createAuth, img);

    return await this.authRepository.save(savedAuth);
  }

  private createAuthValidation(createAuth: CreateAuthDTO): void {
    try {
      this.isNameNull(createAuth.name);
      this.isEmailNull(createAuth.email);
      this.isPasswordNull(createAuth.password);
    } catch (e) {
      throw new SignUpFailError(e);
    }

    return;
  }

  private isNameNull(name: string): void {
    if (name === null) {
      throw 'name';
    }
    return;
  }

  private isEmailNull(email: string): void {
    if (email === null) {
      throw 'email';
    }
    return;
  }

  private isPasswordNull(password: string): void {
    if (password === null) {
      throw 'password';
    }
    return;
  }

  private async createAuthToAuth(
    createAuth: CreateAuthDTO,
    img: Express.Multer.File,
  ): Promise<Auth> {
    return new Auth(
      typeof img == 'undefined' ? null : img.filename,
      createAuth.name,
      createAuth.email,
      await hash(createAuth.password, 10),
      null,
    );
  }

  // 로그인
  async login(loginDTO: LoginDTO): Promise<string> {
    const foundAuth: Auth = await this.authRepository.findByEmail(
      loginDTO.email,
    );

    if (await this.isExistAndIsPasswordMatch(foundAuth, loginDTO)) {
      return this.signToken(foundAuth.email);
    } else {
      throw new LoginFailError('로그인 실패');
    }
  }

  private async isExistAndIsPasswordMatch(
    foundAuth: Auth,
    loginDTO: LoginDTO,
  ): Promise<boolean> {
    return foundAuth && (await compare(loginDTO.password, foundAuth.password));
  }

  private signToken(email: string): string {
    return this.jwtService.sign({ email: email }, { expiresIn: '1d' });
  }
}
