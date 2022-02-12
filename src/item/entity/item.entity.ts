import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ItemDocument = Item & mongoose.Document;

@Schema()
export class Item {
  constructor(
    location?: string,
    image?: string,
    title?: string,
    star?: number,
    content?: string,
    category?: string,
    writer?: Record<string, any>,
  ) {
    this.location = location;
    this.image = image;
    this.title = title;
    this.star = star;
    this.content = content;
    this.category = category;
    this.writer = writer;
  }
  _id: string;

  @Prop({ type: String, required: true })
  location: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: Number, required: true })
  star: number;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  category: string;

  @Prop(
    raw({
      _id: { type: mongoose.Schema.Types.ObjectId },
      name: { type: String },
    }),
  )
  writer: Record<string, any>;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
