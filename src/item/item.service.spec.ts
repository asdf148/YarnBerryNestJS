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

let service: ItemService;
let repository: ItemRepository;
let authRepository: AuthRepository;

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
  let initFoundItem: Item;
  let initModifyItem: CreateOrModifyItem;
  let initModifySavedItem: Item;

  beforeAll(() => {
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

    initFoundItem = foundItem;
    initModifyItem = modifyItem;
    initModifySavedItem = modifySavedItem;
  });

  beforeEach(async () => {
    await injectDependence();
  });

  it('Modify Item 성공', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(initFoundItem);

    jest.spyOn(repository, 'update').mockResolvedValue(initModifySavedItem);

    const result: string = await service.modifyItem(
      '4e0a0d0a0d0a0d0a0d0a0d0',
      initModifyItem,
      undefined,
    );
    expect(result).toBe('Modify Item Success');
  });

  it('Modify Item 실패 (존재하지 않는 Item)', async () => {
    jest.spyOn(repository, 'findOne').mockImplementation(() => {
      throw new Error("Can't find user");
    });

    try {
      await service.modifyItem(
        '4e0a0d0a0d0a0d0a0d0a0d0',
        initModifyItem,
        undefined,
      );
    } catch (e) {
      expect(e).toBeInstanceOf(ModifyItemFail);
      expect(e.message).toBe('Fail to modify item: Item not found');
    }
  });

  it('Modify Item 실패 (Item 저장 실패)', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(initFoundItem);

    jest.spyOn(repository, 'update').mockResolvedValue(initModifySavedItem);

    try {
      await service.modifyItem(
        '4e0a0d0a0d0a0d0a0d0a0d0',
        initModifyItem,
        undefined,
      );
    } catch (e) {
      expect(e).toBeInstanceOf(ModifyItemFail);
      expect(e.message).toBe('Fail to modify item: Item save fail');
    }
  });
});

describe('ItemService: DeleteItem', () => {
  let initFoundUser: Auth;
  let initFoundItem: Item;
  let initDifferentUser: Auth;

  beforeAll(() => {
    const foundUser = new Auth(null, '안녕안녕', 'asdf@asdf.com', null, []);
    foundUser._id = '5e9f9c9f9c9f9c9f9c9f9c9';

    const differenUser = new Auth(null, '하이하이', 'zxcv@zxcv.com', null, []);
    differenUser._id = '1a2x2s2x2s2x2s2x2s2x2s2';

    const item = new Item(
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
    item._id = '4e0a0d0a0d0a0d0a0d0a0d0';

    foundUser.items.push(item);

    initFoundUser = foundUser;
    initFoundItem = item;
    initDifferentUser = differenUser;
  });

  beforeEach(async () => {
    await injectDependence();
  });

  it('Delete Item 성공', async () => {
    jest.spyOn(authRepository, 'findOne').mockResolvedValue(initFoundUser);

    jest.spyOn(repository, 'findOne').mockResolvedValue(initFoundItem);

    jest.spyOn(repository, 'delete').mockResolvedValue(new Item());

    const result = await service.deleteItem(
      '5e9f9c9f9c9f9c9f9c9f9c9',
      '4e0a0d0a0d0a0d0a0d0a0d0',
    );
    expect(result).toBe('Delete Item Success');
  });

  it('Delete Item 실패 (가입되지 않은 auth)', async () => {
    jest.spyOn(authRepository, 'findOne').mockImplementation(() => {
      throw new Error("Can't find user");
    });

    try {
      await service.deleteItem(
        '5e9f9c9f9c9f9c9f9c9f9c9',
        '4e0a0d0a0d0a0d0a0d0a0d0',
      );
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
      await service.deleteItem(
        '5e9f9c9f9c9f9c9f9c9f9c9',
        '4e0a0d0a0d0a0d0a0d0a0d0',
      );
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
      await service.deleteItem(
        '1a2x2s2x2s2x2s2x2s2x2s2',
        '4e0a0d0a0d0a0d0a0d0a0d0',
      );
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
      await service.deleteItem(
        '5e9f9c9f9c9f9c9f9c9f9c9',
        '4e0a0d0a0d0a0d0a0d0a0d0',
      );
    } catch (e) {
      expect(e).toBeInstanceOf(DeleteItemFailError);
      expect(e.message).toBe('Fail to delete item: Item delete fail');
    }
  });
});
