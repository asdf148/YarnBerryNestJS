import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ItemDocument = Item & mongoose.Document;

@Schema()
export class Item {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id: string;

  @Prop()
  image: string;

  @Prop()
  title: string;

  @Prop()
  content: string;
}

export const AuthSchema = SchemaFactory.createForClass(Item);
