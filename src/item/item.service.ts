import { Injectable } from '@nestjs/common';
import { CreateItemFail } from '../dto/error/createItemFailError';
import { AuthRepository } from '../auth/entity/auth.repository';
import { CreateOrModifyItem } from './dto/createOrModifyItem.dto';
import { ItemRepository } from './entity/item.repository';
import { ItemDTOConversion } from './item.dto.conversion';
import { Auth } from '../auth/entity/auth.entity';
import { ModifyItemFail } from '../dto/error/modifyItemFailError';
import { Item } from './entity/item.entity';

@Injectable()
export class ItemService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly itemRepository: ItemRepository,
  ) {}
  itemDTOConversion = new ItemDTOConversion();

  async createItem(
    userId: string,
    createItem: CreateOrModifyItem,
    img?: Express.Multer.File,
  ): Promise<string> {
    let foundUser = new Auth();
    try {
      foundUser = await this.authRepository.findOne(userId);
    } catch (e) {
      throw new CreateItemFail('Fail to create item: User not found');
    }

    const createItemToItem =
      this.itemDTOConversion.CreateOrModifyItemToItem(createItem);

    createItemToItem.image = typeof img == 'undefined' ? null : img.filename;
    createItemToItem.writer = { _id: foundUser._id, name: foundUser.name };

    try {
      await this.itemRepository.save(createItemToItem);
      return 'Create Item Success';
    } catch (e) {
      throw new CreateItemFail('Fail to create item: Item save fail');
    }
  }

  async modifyItem(
    itemId: string,
    modifyItem: CreateOrModifyItem,
    img?: Express.Multer.File,
  ): Promise<string> {
    let foundItem = new Item();
    try {
      foundItem = await this.itemRepository.findOne(itemId);
    } catch (e) {
      throw new ModifyItemFail('Fail to modify item: Item not found');
    }

    foundItem.location = modifyItem.location;
    foundItem.image = typeof img == 'undefined' ? null : img.filename;
    foundItem.star = modifyItem.star;
    foundItem.title = modifyItem.title;
    foundItem.content = modifyItem.content;
    foundItem.category = modifyItem.category;

    try {
      await this.itemRepository.update(itemId, foundItem);
      return 'Modify Item Success';
    } catch (e) {
      throw new ModifyItemFail('Fail to modify item: Item save fail');
    }
  }
}
