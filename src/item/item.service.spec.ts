import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateItemFail } from '../dto/error/createItemFailError';
import { Auth } from '../auth/entity/auth.entity';
import { AuthRepository } from '../auth/entity/auth.repository';
import { CreateItem } from './dto/createItem.dto';
import { Item } from './entity/item.entity';
import { ItemRepository } from './entity/item.repository';
import { ItemService } from './item.service';

describe('ItemService', () => {
  let service: ItemService;
  let repository: ItemRepository;
  let authRepository: AuthRepository;
  let initCreateItem: CreateItem;
  let initSavedItem: Item;

  beforeAll(() => {
    const createItem = new CreateItem(
      '서울시 서초구 서초동',
      'ㅇㅇ카페',
      4.0,
      '이 카페는 좋은 카페입니다.',
      '카페',
    );

    const savedItem = new Item(
      null,
      createItem.location,
      createItem.title,
      createItem.star,
      createItem.content,
      createItem.category,
    );

    initCreateItem = createItem;
    initSavedItem = savedItem;
  });

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
        AuthRepository,
        {
          provide: getModelToken(Auth.name),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          useFactory: () => {},
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    repository = module.get<ItemRepository>(ItemRepository);
    authRepository = module.get<AuthRepository>(AuthRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Create Item 성공', async () => {
    const foundUser = new Auth(null, '안녕안녕', 'asdf@asdf.com', null, null);
    foundUser._id = '5e9f9c9f9c9f9c9f9c9f9c9';

    jest
      .spyOn(authRepository, 'findOne')
      .mockImplementation(() => Promise.resolve(foundUser));

    jest
      .spyOn(repository, 'save')
      .mockImplementation(() => Promise.resolve(initSavedItem));

    const result: string = await service.createItem(
      '5e9f9c9f9c9f9c9f9c9f9c9',
      initCreateItem,
    );
    expect(result).toBe('Create Item Success');
  });

  it('Create Item 실패 (가입되지 않은 유저)', async () => {
    jest.spyOn(authRepository, 'findOne').mockImplementation(() => {
      throw new Error("Can't find user");
    });

    try {
      await service.createItem('5e9f9c9f9c9f9c9f9c9f9c9', initCreateItem);
    } catch (e) {
      expect(e).toBeInstanceOf(CreateItemFail);
      expect(e.message).toBe('Fail to create item: User not found');
    }
  });
});
