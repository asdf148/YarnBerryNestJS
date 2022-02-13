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
      //따로 아이디 받아서 내가 넣어 줘야 될 듯
      createItem.writer,
    );

    return item;
  }
}
