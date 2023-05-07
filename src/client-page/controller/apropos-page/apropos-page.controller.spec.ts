import { Test, TestingModule } from '@nestjs/testing';
import { AproposPageController } from './apropos-page.controller';

describe('AproposPageController', () => {
  let controller: AproposPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AproposPageController],
    }).compile();

    controller = module.get<AproposPageController>(AproposPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
