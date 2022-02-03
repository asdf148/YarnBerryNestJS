import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocument } from './item.entity';

@Injectable()
export class ItemRepository {
  constructor(@InjectModel(Item.name) private itemModel: Model<ItemDocument>) {}

  // 전체 조회
  async findAll(): Promise<Item[]> {
    return await this.itemModel.find().exec();
  }

  // 한 개만 찾아서 반환
  async findOne(id: string): Promise<Item> {
    return await this.itemModel.findById(id).exec();
  }

  // 저장하기
  async save(item: Item): Promise<Item> {
    const createdItem = new this.itemModel(item);
    return await createdItem.save();
  }

  // 수정
  async update(id: string, item: Item): Promise<Item> {
    return await this.itemModel
      .findByIdAndUpdate(id, item, { new: true })
      .exec();
  }

  // 삭제
  async delete(id: string): Promise<Item> {
    return await this.itemModel.findByIdAndDelete(id).exec();
  }
}
