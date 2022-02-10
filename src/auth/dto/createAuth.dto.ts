import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateAuthDTO {
  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  @IsString()
  @ApiProperty({
    description: '이름',
    example: '안녕안녕',
    required: true,
  })
  name: string;

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
