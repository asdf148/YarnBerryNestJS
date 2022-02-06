import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth, AuthSchema } from './entity/auth.entity';
import { AuthRepository } from './entity/auth.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { issuer: 'MyServer' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
})
export class AuthModule {}
