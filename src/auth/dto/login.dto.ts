import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDTO {
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  @IsEmail()
  @ApiProperty({
    description: '이메일',
    example: 'asdf@asdf.com',
    required: true,
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: '비밀번호',
    example: '123456789',
    required: true,
  })
  password: string;
}
