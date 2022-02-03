import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from './auth.entity';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(Auth.name) private authModel: Model<AuthDocument>) {}

  // 전체 조회
  async findAll(): Promise<Auth[]> {
    return await this.authModel.find().exec();
  }

  // 한 개만 찾아서 반환
  async findOne(id: string): Promise<Auth> {
    return await this.authModel.findById(id).exec();
  }

  // 저장하기
  async save(auth: Auth): Promise<Auth> {
    const createdCat = new this.authModel(auth);
    return await createdCat.save();
  }

  // 수정
  async update(id: string, auth: Auth): Promise<Auth> {
    return await this.authModel
      .findByIdAndUpdate(id, auth, { new: true })
      .exec();
  }

  // 삭제
  async delete(id: string): Promise<Auth> {
    return await this.authModel.findByIdAndDelete(id).exec();
  }
}
