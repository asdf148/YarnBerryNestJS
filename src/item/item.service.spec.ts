import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateItem } from './dto/createItem.dto';
import { Item } from './entity/item.entity';
import { ItemRepository } from './entity/item.repository';
import { ItemService } from './item.service';

describe('ItemService', () => {
  let service: ItemService;
  let repository: ItemRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        ItemRepository,
        {
          provide: getModelToken(Item.name),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          useFactory: () => {},
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    repository = module.get<ItemRepository>(ItemRepository);
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

    const savedItem = new Item(
      null,
      createItem.location,
      createItem.title,
      createItem.star,
      createItem.content,
      createItem.category,
      createItem.writer,
    );

    jest
      .spyOn(repository, 'save')
      .mockImplementation(() => Promise.resolve(savedItem));

    const result: string = await service.createItem(null, createItem);
    expect(result).toBe('Create Item Success');
  });
});
