import { Test, TestingModule } from '@nestjs/testing';
import { Item } from './entity/item.entity';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { Response } from 'express';
import { SuccessResponseDTO } from 'src/dto/successResponse.dto';
import { FailResponseDTO } from 'src/dto/failResponse.dto';
import { GetItemFailError } from './dto/error/getItemFailError';
import { GetItemsFailError } from './dto/error/getItemsFailError';
import { CreateOrModifyItem } from './dto/createOrModifyItem.dto';
import { CreateItemFail } from 'src/dto/error/createItemFailError';
import { ModifyItemFail } from 'src/dto/error/modifyItemFailError';
import { DeleteItemFailError } from './dto/error/deleteItemFailError';

let controller: ItemController;
let service: ItemService;
const responseMock = {
  statusCode: Number,

  status: jest.fn((httpStatusCode: number) => {
    responseMock.statusCode = httpStatusCode;
    return responseMock;
  }),
  json: jest.fn((body) => {
    responseMock.send = body;
    return responseMock;
  }),
} as unknown as Response;

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

async function injectDependency() {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [ItemController],
    providers: [
      {
        provide: ItemService,
        useValue: {
          getItem: jest.fn(),
          getItems: jest.fn(),
          createItem: jest.fn(),
          modifyItem: jest.fn(),
          deleteItem: jest.fn(),
        },
      },
    ],
  }).compile();

  controller = module.get<ItemController>(ItemController);
  service = module.get<ItemService>(ItemService);
}

describe('ItemController', () => {
  beforeEach(async () => {
    await injectDependency();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

describe('ItemController: Get Item', () => {
  beforeEach(async () => {
    await injectDependency();
  });

  it('GetItem 성공', async () => {
    const getItemSuccessResponse = new SuccessResponseDTO<Item>(
      'GetItem Success',
      null,
      item,
    );

    jest.spyOn(service, 'getItem').mockResolvedValue(item);

    const result = await executGetItem();
    expect(result).toEqual(getItemSuccessResponse);
  });

  it('GetItem 실패', async () => {
    const getItemFailResponse = new FailResponseDTO(
      'GetItem Fail',
      'Fail to get item: Item not found',
    );

    jest.spyOn(service, 'getItem').mockImplementation(() => {
      throw new GetItemFailError('Fail to get item: Item not found');
    });

    const result = await executGetItem();
    expect(result).toEqual(getItemFailResponse);
  });

  async function executGetItem(): Promise<Item> {
    return await controller.getItem('4e0a0d0a0d0a0d0a0d0a0d1', responseMock);
  }
});

describe('ItemController: Get Items', () => {
  beforeEach(async () => {
    await injectDependency();
  });

  it('GetItems 성공', async () => {
    const getItemsSuccessResponse = new SuccessResponseDTO<Item[]>(
      'GetItems Success',
      null,
      [item],
    );

    jest.spyOn(service, 'getItems').mockResolvedValue([item]);

    const result = await controller.getItems(responseMock);
    expect(result).toEqual(getItemsSuccessResponse);
  });

  it('GetItems 실패', async () => {
    const getItemsFailResponse = new FailResponseDTO(
      'GetItems Fail',
      'Fail to get items: Fail to load items',
    );

    jest.spyOn(service, 'getItems').mockImplementation(() => {
      throw new GetItemsFailError('Fail to get items: Fail to load items');
    });

    const result = await controller.getItems(responseMock);
    expect(result).toEqual(getItemsFailResponse);
  });
});

describe('ItemController: Create Item', () => {
  let initCreateItem: CreateOrModifyItem;

  beforeAll(() => {
    const createItem = new CreateOrModifyItem(
      '서울시 서초구 서초동',
      'ㅇㅇ카페',
      4.0,
      '이 카페는 좋은 카페입니다.',
      '카페',
    );

    initCreateItem = createItem;
  });

  beforeEach(async () => {
    await injectDependency();
  });

  it('CreateItem 성공', async () => {
    const createItemSuccessResponse = new SuccessResponseDTO<Item>(
      'CreateItem Success',
      'Create Item Success',
    );

    jest.spyOn(service, 'createItem').mockResolvedValue('Create Item Success');

    const result = await executCreateItem();
    expect(result).toEqual(createItemSuccessResponse);
  });

  it('CreateItem 실패 (가입되지 않은 유저)', async () => {
    const createItemFailResponse = new FailResponseDTO(
      'CreateItem Fail',
      'Fail to create item: User not found',
    );

    jest.spyOn(service, 'createItem').mockImplementation(() => {
      throw new CreateItemFail('Fail to create item: User not found');
    });

    const result = await executCreateItem();
    expect(result).toEqual(createItemFailResponse);
  });

  it('Create Item 실패 (Item 저장 실패)', async () => {
    const createItemFailResponse = new FailResponseDTO(
      'CreateItem Fail',
      'Fail to create item: Item save fail',
    );

    jest.spyOn(service, 'createItem').mockImplementation(() => {
      throw new CreateItemFail('Fail to create item: Item save fail');
    });

    const result = await executCreateItem();
    expect(result).toEqual(createItemFailResponse);
  });

  async function executCreateItem(): Promise<string> {
    return await controller.createItem(
      null,
      '5e9f9c9f9c9f9c9f9c9f9c9',
      initCreateItem,
      responseMock,
    );
  }
});

describe('ItemController: Modify Item', () => {
  let initModifyItem: CreateOrModifyItem;

  beforeAll(async () => {
    const modifyItem = new CreateOrModifyItem(
      '서울특별시 마포구 ㅇㅇ로',
      'ㅇㅇ포차',
      2.5,
      '이 술집 별로임',
      '술집',
    );

    initModifyItem = modifyItem;
  });

  beforeEach(async () => {
    await injectDependency();
  });

  it('Modify Item 성공', async () => {
    const modifyItemSuccessResponse = new SuccessResponseDTO<Item>(
      'ModifyItem Success',
      'Modify Item Success',
    );

    jest.spyOn(service, 'modifyItem').mockResolvedValue('Modify Item Success');

    const result = await executModifyItem();
    expect(result).toEqual(modifyItemSuccessResponse);
  });

  it('Modify Item 실패 (존재하지 않는 Item)', async () => {
    const modifyItemFailResponse = new FailResponseDTO(
      'ModifyItem Fail',
      'Fail to modify item: Item not found',
    );

    jest.spyOn(service, 'modifyItem').mockImplementation(() => {
      throw new ModifyItemFail('Fail to modify item: Item not found');
    });

    const result = await executModifyItem();
    expect(result).toEqual(modifyItemFailResponse);
  });

  it('Modify Item 실패 (Item 저장 실패)', async () => {
    const modifyItemFailResponse = new FailResponseDTO(
      'ModifyItem Fail',
      'Fail to modify item: Item save fail',
    );

    jest.spyOn(service, 'modifyItem').mockImplementation(() => {
      throw new ModifyItemFail('Fail to modify item: Item save fail');
    });

    const result = await executModifyItem();
    expect(result).toEqual(modifyItemFailResponse);
  });

  async function executModifyItem(): Promise<string> {
    return await controller.modifyItem(
      item._id,
      initModifyItem,
      null,
      responseMock,
    );
  }
});

describe('ItemController: Delete Item', () => {
  beforeEach(async () => {
    await injectDependency();
  });

  it('Delete Item 성공', async () => {
    const deleteItemSuccessResponse = new SuccessResponseDTO<Item>(
      'DeleteItem Success',
      'Delete Item Success',
    );

    jest.spyOn(service, 'deleteItem').mockResolvedValue('Delete Item Success');

    const result = await executDeleteItem();
    expect(result).toEqual(deleteItemSuccessResponse);
  });

  it('Delete Item 실패 (존재하지 않는 Item)', async () => {
    const deleteItemFailResponse = new FailResponseDTO(
      'DeleteItem Fail',
      'Fail to delete item: Item not found',
    );

    jest.spyOn(service, 'deleteItem').mockImplementation(() => {
      throw new DeleteItemFailError('Fail to delete item: Item not found');
    });

    const result = await executDeleteItem();
    expect(result).toEqual(deleteItemFailResponse);
  });

  it('Delete Item 실패 (Item 삭제 실패)', async () => {
    const deleteItemFailResponse = new FailResponseDTO(
      'DeleteItem Fail',
      'Fail to delete item: Item delete fail',
    );

    jest.spyOn(service, 'deleteItem').mockImplementation(() => {
      throw new DeleteItemFailError('Fail to delete item: Item delete fail');
    });

    const result = await executDeleteItem();
    expect(result).toEqual(deleteItemFailResponse);
  });

  async function executDeleteItem(): Promise<string> {
    return await controller.deleteItem(item._id, responseMock);
  }
});
