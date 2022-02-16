import { Injectable } from '@nestjs/common';
import { CreateItemFail } from '../dto/error/createItemFailError';
import { AuthRepository } from '../auth/entity/auth.repository';
import { CreateOrModifyItem } from './dto/createOrModifyItem.dto';
import { ItemRepository } from './entity/item.repository';
import { ItemDTOConversion } from './item.dto.conversion';
import { Auth } from '../auth/entity/auth.entity';
import { ModifyItemFail } from '../dto/error/modifyItemFailError';
import { Item } from './entity/item.entity';
import { DeleteItemFailError } from './dto/error/deleteItemFailError';

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
    const foundUser = await this.findUser('create', userId);
    const itemWithWriter = this.createItemWithWriter(
      foundUser,
      createItem,
      img,
    );

    try {
      await this.itemRepository.save(itemWithWriter);
      return 'Create Item Success';
    } catch (e) {
      throw new CreateItemFail('Fail to create item: Item save fail');
    }
  }

  private createItemWithWriter(
    foundUser: Auth,
    createItem: CreateOrModifyItem,
    img?: Express.Multer.File,
  ): Item {
    const itemWithWriter =
      this.itemDTOConversion.CreateOrModifyItemToItem(createItem);

    itemWithWriter.image = typeof img == 'undefined' ? null : img.filename;
    itemWithWriter.writer = { _id: foundUser._id, name: foundUser.name };

    return itemWithWriter;
  }

  private async findUser(method: string, userId: string): Promise<Auth> {
    try {
      return await this.authRepository.findOne(userId);
    } catch (e) {
      if (method == 'create') {
        throw new CreateItemFail(`Fail to ${method} item: User not found`);
      } else {
        throw new DeleteItemFailError(`Fail to ${method} item: User not found`);
      }
    }
  }

  async modifyItem(
    itemId: string,
    modifyItem: CreateOrModifyItem,
    img?: Express.Multer.File,
  ): Promise<string> {
    const foundItem = await this.findItem('modify', itemId);
    const foundItemWithModifyItemValue = this.injectModifyItemValue(
      foundItem,
      modifyItem,
      img,
    );

    try {
      await this.itemRepository.update(itemId, foundItemWithModifyItemValue);
      return 'Modify Item Success';
    } catch (e) {
      throw new ModifyItemFail('Fail to modify item: Item save fail');
    }
  }

  private injectModifyItemValue(
    foundItem: Item,
    modifyItem: CreateOrModifyItem,
    img?: Express.Multer.File,
  ): Item {
    foundItem.location = modifyItem.location;
    foundItem.image = typeof img == 'undefined' ? null : img.filename;
    foundItem.star = modifyItem.star;
    foundItem.title = modifyItem.title;
    foundItem.content = modifyItem.content;
    foundItem.category = modifyItem.category;

    return foundItem;
  }

  private async findItem(method: string, itemId: string): Promise<Item> {
    try {
      return await this.itemRepository.findOne(itemId);
    } catch (e) {
      if (method == 'modify') {
        throw new ModifyItemFail(`Fail to ${method} item: Item not found`);
      } else {
        throw new DeleteItemFailError(`Fail to ${method} item: Item not found`);
      }
    }
  }

  async deleteItem(userId: string, deleteItemId: string): Promise<string> {
    const foundUser = await this.findUser('delete', userId);
    const foundItem = await this.findItem('delete', deleteItemId);

    this.permissionCheck(foundItem.writer._id, foundUser._id);

    return this.deleteItemWithErrorHandling(deleteItemId);
  }

  private permissionCheck(itemWriterId: string, userId: string): void {
    if (!this.isItemWriterIdAndUserIdEqual(itemWriterId, userId)) {
      throw new DeleteItemFailError('Fail to delete item: No permission');
    }
  }

  private isItemWriterIdAndUserIdEqual(
    itemWriterId: string,
    userId: string,
  ): boolean {
    return itemWriterId == userId;
  }

  private deleteItemWithErrorHandling(deleteItemId: string): string {
    try {
      this.itemRepository.delete(deleteItemId);
      return 'Delete Item Success';
    } catch (e) {
      throw new DeleteItemFailError('Fail to delete item: Item delete fail');
    }
  }
}
