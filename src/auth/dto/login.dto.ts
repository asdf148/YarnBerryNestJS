import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDTO {
  constructor(email?: string, password?: string) {
    this.email = email;
    this.password = password;
  }

  @IsEmail()
  @ApiProperty({ description: '이메일' })
  email: string;

  @IsString()
  @ApiProperty({ description: '비밀번호' })
  password: string;
}
