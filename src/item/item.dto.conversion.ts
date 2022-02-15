import { CreateOrModifyItem } from './dto/createOrModifyItem.dto';
import { Item } from './entity/item.entity';

export class ItemDTOConversion {
  public CreateOrModifyItemToItem(createOrModifyItem: CreateOrModifyItem) {
    const item = new Item(
      createOrModifyItem.location,
      null,
      createOrModifyItem.title,
      createOrModifyItem.star,
      createOrModifyItem.content,
      createOrModifyItem.category,
    );

    return item;
  }
}
