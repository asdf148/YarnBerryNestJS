import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Item } from 'src/item/entity/item.entity';

export type AuthDocument = Auth & mongoose.Document;

@Schema()
export class Auth {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id: string;

  @Prop()
  image: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Item' })
  item: Item[];
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
