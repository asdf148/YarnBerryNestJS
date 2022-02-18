import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from './item.controller';

let controller: ItemController;

async function injectDependency() {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [ItemController],
  }).compile();

  controller = module.get<ItemController>(ItemController);
}

describe('ItemController', () => {
  beforeEach(async () => {
    await injectDependency();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
