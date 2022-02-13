import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateItem {
  constructor(
    location?: string,
    title?: string,
    star?: number,
    content?: string,
    category?: string,
  ) {
    this.location = location;
    this.title = title;
    this.star = star;
    this.content = content;
    this.category = category;
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
}
