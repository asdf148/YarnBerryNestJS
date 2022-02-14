import { Injectable } from '@nestjs/common';
import { CreateItemFail } from '../dto/error/createItemFailError';
import { AuthRepository } from '../auth/entity/auth.repository';
import { CreateItem } from './dto/createItem.dto';
import { ItemRepository } from './entity/item.repository';
import { ItemDTOConversion } from './item.dto.conversion';
import { Auth } from 'src/auth/entity/auth.entity';

@Injectable()
export class ItemService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly itemRepository: ItemRepository,
  ) {}
  itemDTOConversion = new ItemDTOConversion();

  async createItem(
    img: Express.Multer.File,
    userId: string,
    createItem: CreateItem,
  ): Promise<string> {
    let foundUser = new Auth();
    try {
      foundUser = await this.authRepository.findOne(userId);
    } catch (e) {
      throw new CreateItemFail('Fail to create item: User not found');
    }

    const createItemToItem =
      this.itemDTOConversion.CreateItemToItem(createItem);

    createItemToItem.image = img.filename;
    createItemToItem.writer = { _id: foundUser._id, name: foundUser.name };

    try {
      await this.itemRepository.save(createItemToItem);
      return 'Create Item Success';
    } catch (e) {
      throw new CreateItemFail('Fail to create item: Item save fail');
    }
  }
}
