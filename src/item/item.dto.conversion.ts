import { CreateItem } from './dto/createItem.dto';
import { Item } from './entity/item.entity';

export class ItemDTOConversion {
  public CreateItemToItem(createItem: CreateItem) {
    const item = new Item(
      createItem.location,
      null,
      createItem.title,
      createItem.star,
      createItem.content,
      createItem.category,
    );

    return item;
  }
}
