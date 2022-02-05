import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Item } from 'src/item/entity/item.entity';

export type AuthDocument = Auth & mongoose.Document;

@Schema()
export class Auth {
  constructor(
    id?: string,
    image?: string,
    name?: string,
    email?: string,
    password?: string,
    items?: Item[],
  ) {
    this.id = id;
    this.image = image;
    this.name = name;
    this.email = email;
    this.password = password;
    this.items = items;
  }

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Item' })
  items: Item[];
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
