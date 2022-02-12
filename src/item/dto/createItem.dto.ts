import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateItem {
  constructor(
    location?: string,
    title?: string,
    star?: number,
    content?: string,
    category?: string,
    writer?: Record<string, any>,
  ) {
    this.location = location;
    this.title = title;
    this.star = star;
    this.content = content;
    this.category = category;
    this.writer = writer;
  }

  @IsString()
  @ApiProperty({
    description: '위치',
    example: '서울특별시 강남구 역삼동',
    required: true,
  })
  public location: string;

  @IsString()
  @ApiProperty({
    description: '장소',
    example: '...카페',
    required: true,
  })
  public title: string;

  @IsNumber()
  @ApiProperty({
    description: '별점',
    example: '4.5',
    required: true,
  })
  public star: number;

  @IsString()
  @ApiProperty({
    description: '설명',
    example: '카페 설명',
    required: true,
  })
  public content: string;

  @IsString()
  @ApiProperty({
    description: '카테고리',
    example: '카페',
    required: true,
  })
  public category: string;

  @IsString()
  @ApiProperty({
    description: '작성자',
    example: {
      _id: '5e9f8f8f8f8f8f8f8f8f8f8',
      name: '안녕안녕',
    },
    required: true,
  })
  public writer: Record<string, any>;
}
