import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from '../auth/entity/auth.entity';
import { AuthRepository } from '../auth/entity/auth.repository';
import { Item, ItemSchema } from './entity/item.entity';
import { ItemRepository } from './entity/item.repository';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
  ],
  providers: [ItemService, AuthRepository, ItemRepository],
  controllers: [ItemController],
})
export class ItemModule {}
