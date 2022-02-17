import { IsArray } from 'class-validator';
import { Item } from '../entity/item.entity';

export class ItemsDTO {
  @IsArray()
  items: Item[];
}
