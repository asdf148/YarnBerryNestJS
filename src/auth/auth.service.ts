import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { CreateAuthDTO } from './dto/createAuth.dto';
import { Auth } from './entity/auth.entity';
import { AuthRepository } from './entity/auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

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
}
