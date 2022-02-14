import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './entity/item.entity';
import { ItemRepository } from './entity/item.repository';
import { ItemService } from './item.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
  ],
  providers: [ItemService, ItemRepository],
})
export class ItemModule {}
