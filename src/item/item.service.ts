import { Injectable } from '@nestjs/common';
import { CreateItem } from './dto/createItem.dto';
import { ItemRepository } from './entity/item.repository';
import { ItemDTOConversion } from './item.dto.conversion';

@Injectable()
export class ItemService {
  constructor(private readonly itemRepository: ItemRepository) {}
  itemDTOConversion = new ItemDTOConversion();

  async createItem(img: Express.Multer.File, createItem: CreateItem) {
    const createItemToItem =
      this.itemDTOConversion.CreateItemToItem(createItem);

    try {
      await this.itemRepository.save(createItemToItem);
      return 'Create Item Success';
    } catch (e) {
      throw new Error('Create Item Fail');
    }
  }
}
