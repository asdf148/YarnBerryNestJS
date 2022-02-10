import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateAuthDTO {
  constructor(
    image?: string,
    name?: string,
    email?: string,
    password?: string,
  ) {
    this.image = image;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  @IsString()
  @ApiProperty({ description: '이미지 경로' })
  image: string;

  @IsString()
  @ApiProperty({ description: '이름' })
  name: string;

  @IsEmail()
  @ApiProperty({ description: '이메일' })
  email: string;

  @IsString()
  @ApiProperty({ description: '비밀번호' })
  password: string;
}
