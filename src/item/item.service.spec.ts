import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateItemFail } from '../dto/error/createItemFailError';
import { Auth } from '../auth/entity/auth.entity';
import { AuthRepository } from '../auth/entity/auth.repository';
import { CreateOrModifyItem } from './dto/createOrModifyItem.dto';
import { Item } from './entity/item.entity';
import { ItemRepository } from './entity/item.repository';
import { ItemService } from './item.service';
import { ModifyItemFail } from '../dto/error/modifyItemFailError';
import { DeleteItemFailError } from './dto/error/deleteItemFailError';
import { ItemsDTO } from './dto/items.dto';
import { GetItemsFailError } from './dto/error/getItemsFailError';
import { GetItemFailError } from './dto/error/getItemFailError';

let service: ItemService;
let repository: ItemRepository;
let authRepository: AuthRepository;

const foundItem = new Item(
  '서울시 서초구 서초동',
  null,
  'ㅇㅇ카페',
  4.0,
  '이 카페는 좋은 카페입니다.',
  '카페',
  {
    _id: '5e9f9c9f9c9f9c9f9c9f9c9',
    name: '안녕안녕',
  },
);
foundItem._id = '4e0a0d0a0d0a0d0a0d0a0d0';

async function injectDependence() {
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
}

describe('ItemService: GetItem', () => {
  beforeEach(async () => {
    await injectDependence();
  });

  it('Get Items 성공', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(foundItem);

    const result = await service.getItem('4e0a0d0a0d0a0d0a0d0a0d0');
    expect(result).toBe(foundItem);
  });

  it('Get Item 실패 (존재하지 않는 아이템)', async () => {
    jest
      .spyOn(repository, 'findOne')
      .mockRejectedValue(new Error('Fail to load item'));

    try {
      await service.getItem('4e0a0d0a0d0a0d0a0d0a0d0');
    } catch (e) {
      expect(e).toBeInstanceOf(GetItemFailError);
      expect(e.message).toBe('Fail to get items: Fail to load item');
    }
  });
});

describe('ItemService: GetItems', () => {
  const initItems: Item[] = [foundItem, foundItem];

  beforeEach(async () => {
    await injectDependence();
  });

  it('Get Items 성공', async () => {
    const items: ItemsDTO = new ItemsDTO();
    items.items = initItems;
    jest.spyOn(repository, 'findAll').mockResolvedValue(initItems);

    const result = await service.getItems();
    expect(result).toStrictEqual(items);
  });

  it('Get Items 실패 (Items 가져오기 실패)', async () => {
    jest
      .spyOn(repository, 'findAll')
      .mockRejectedValue(new Error('Fail to load items'));

    try {
      await service.getItems();
    } catch (e) {
      expect(e).toBeInstanceOf(GetItemsFailError);
      expect(e.message).toBe('Fail to get items: Fail to load items');
    }
  });
});

describe('ItemService: CreateItem', () => {
  let initCreateItem: CreateOrModifyItem;
  let initSavedItem: Item;
  let initFoundUser: Auth;

  beforeAll(() => {
    const createItem = new CreateOrModifyItem(
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

    const foundUser = new Auth(null, '안녕안녕', 'asdf@asdf.com', null, null);
    foundUser._id = '5e9f9c9f9c9f9c9f9c9f9c9';

    initCreateItem = createItem;
    initSavedItem = savedItem;
    initFoundUser = foundUser;
  });

  beforeEach(async () => {
    await injectDependence();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Create Item 성공', async () => {
    jest.spyOn(authRepository, 'findOne').mockResolvedValue(initFoundUser);

    jest.spyOn(repository, 'save').mockResolvedValue(initSavedItem);

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

  it('Create Item 실패 (Item 저장 실패)', async () => {
    jest.spyOn(authRepository, 'findOne').mockResolvedValue(initFoundUser);

    jest.spyOn(repository, 'save').mockImplementation(() => {
      throw new Error("Can't save item");
    });

    try {
      await service.createItem('5e9f9c9f9c9f9c9f9c9f9c9', initCreateItem);
    } catch (e) {
      expect(e).toBeInstanceOf(CreateItemFail);
      expect(e.message).toBe('Fail to create item: Item save fail');
    }
  });
});

describe('ItemService: ModifyItem', () => {
  const initFoundItem: Item = foundItem;
  let initModifyItem: CreateOrModifyItem;
  let initModifySavedItem: Item;

  beforeAll(() => {
    const modifyItem = new CreateOrModifyItem(
      '서울특별시 마포구 ㅇㅇ로',
      'ㅇㅇ포차',
      2.5,
      '이 술집 별로임',
      '술집',
    );

    const modifySavedItem = new Item(
      modifyItem.location,
      '수정된 이미지',
      modifyItem.title,
      modifyItem.star,
      modifyItem.content,
      modifyItem.category,
    );
    modifySavedItem._id = foundItem._id;
    modifySavedItem.writer = foundItem.writer;

    initModifyItem = modifyItem;
    initModifySavedItem = modifySavedItem;
  });

  beforeEach(async () => {
    await injectDependence();
  });

  it('Modify Item 성공', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(initFoundItem);

    jest.spyOn(repository, 'update').mockResolvedValue(initModifySavedItem);

    const result: string = await executModifyItem(initModifyItem);
    expect(result).toBe('Modify Item Success');
  });

  it('Modify Item 실패 (존재하지 않는 Item)', async () => {
    jest.spyOn(repository, 'findOne').mockImplementation(() => {
      throw new Error("Can't find user");
    });

    try {
      await executModifyItem(initModifyItem);
    } catch (e) {
      expect(e).toBeInstanceOf(ModifyItemFail);
      expect(e.message).toBe('Fail to modify item: Item not found');
    }
  });

  it('Modify Item 실패 (Item 저장 실패)', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(initFoundItem);

    jest.spyOn(repository, 'update').mockResolvedValue(initModifySavedItem);

    try {
      await executModifyItem(initModifyItem);
    } catch (e) {
      expect(e).toBeInstanceOf(ModifyItemFail);
      expect(e.message).toBe('Fail to modify item: Item save fail');
    }
  });
});

async function executModifyItem(
  initModifyItem: CreateOrModifyItem,
): Promise<string> {
  return await service.modifyItem(
    '4e0a0d0a0d0a0d0a0d0a0d0',
    initModifyItem,
    undefined,
  );
}

describe('ItemService: DeleteItem', () => {
  let initFoundUser: Auth;
  const initFoundItem: Item = foundItem;
  let initDifferentUser: Auth;

  beforeAll(() => {
    const foundUser = new Auth(null, '안녕안녕', 'asdf@asdf.com', null, []);
    foundUser._id = '5e9f9c9f9c9f9c9f9c9f9c9';

    const differentUser = new Auth(null, '하이하이', 'zxcv@zxcv.com', null, []);
    differentUser._id = '1a2x2s2x2s2x2s2x2s2x2s2';

    foundUser.items.push(foundItem);

    initFoundUser = foundUser;
    initDifferentUser = differentUser;
  });

  beforeEach(async () => {
    await injectDependence();
  });

  it('Delete Item 성공', async () => {
    jest.spyOn(authRepository, 'findOne').mockResolvedValue(initFoundUser);

    jest.spyOn(repository, 'findOne').mockResolvedValue(initFoundItem);

    jest.spyOn(repository, 'delete').mockResolvedValue(new Item());

    const result = await executDeleteItem();
    expect(result).toBe('Delete Item Success');
  });

  it('Delete Item 실패 (가입되지 않은 auth)', async () => {
    jest.spyOn(authRepository, 'findOne').mockImplementation(() => {
      throw new Error("Can't find user");
    });

    try {
      await executDeleteItem();
    } catch (e) {
      expect(e).toBeInstanceOf(DeleteItemFailError);
      expect(e.message).toBe('Fail to delete item: User not found');
    }
  });

  it('Delete Item 실패 (존재하지 않는 Item)', async () => {
    jest.spyOn(authRepository, 'findOne').mockResolvedValue(initFoundUser);

    jest.spyOn(repository, 'findOne').mockImplementation(() => {
      throw new Error("Can't find item");
    });

    try {
      await executDeleteItem();
    } catch (e) {
      expect(e).toBeInstanceOf(DeleteItemFailError);
      expect(e.message).toBe('Fail to delete item: Item not found');
    }
  });

  it('Delete Item 실패 (존재하지 않는 Item)', async () => {
    jest.spyOn(authRepository, 'findOne').mockResolvedValue(initDifferentUser);

    jest.spyOn(repository, 'findOne').mockResolvedValue(initFoundItem);

    jest.spyOn(repository, 'delete').mockImplementation(() => {
      throw new Error("Can't delete item");
    });

    try {
      await executDeleteItem('1a2x2s2x2s2x2s2x2s2x2s2');
    } catch (e) {
      expect(e).toBeInstanceOf(DeleteItemFailError);
      expect(e.message).toBe('Fail to delete item: No permission');
    }
  });

  it('Delete Item 실패 (Item 삭제 실패)', async () => {
    jest.spyOn(authRepository, 'findOne').mockResolvedValue(initFoundUser);

    jest.spyOn(repository, 'findOne').mockResolvedValue(initFoundItem);

    jest.spyOn(repository, 'delete').mockImplementation(() => {
      throw new Error("Can't delete item");
    });

    try {
      await executDeleteItem();
    } catch (e) {
      expect(e).toBeInstanceOf(DeleteItemFailError);
      expect(e.message).toBe('Fail to delete item: Item delete fail');
    }
  });

  async function executDeleteItem(
    userId = '5e9f9c9f9c9f9c9f9c9f9c9',
  ): Promise<string> {
    return await service.deleteItem(userId, '4e0a0d0a0d0a0d0a0d0a0d0');
  }
});
