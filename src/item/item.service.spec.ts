import { Test, TestingModule } from '@nestjs/testing';
import { CreateItem } from './dto/createItem.dto';
import { ItemService } from './item.service';

describe('ItemService', () => {
  let service: ItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemService],
    }).compile();

    service = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Create Item 성공', async () => {
    const createItem = new CreateItem(
      '서울시 서초구 서초동',
      'ㅇㅇ카페',
      4.0,
      '이 카페는 좋은 카페입니다.',
      '카페',
      {
        _id: '5e9f9c9f9c9f9c9f9c9f9c9',
        name: '안녕안녕',
      },
    );

    const result: string = await service.createItem(createItem);
    expect(result).toBe('Create Item Success');
  });
});
