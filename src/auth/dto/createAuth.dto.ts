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
  image: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
