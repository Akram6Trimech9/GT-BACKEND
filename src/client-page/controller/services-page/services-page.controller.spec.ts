import { Test, TestingModule } from '@nestjs/testing';
import { ServicesPageController } from './services-page.controller';

describe('ServicesPageController', () => {
  let controller: ServicesPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesPageController],
    }).compile();

    controller = module.get<ServicesPageController>(ServicesPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
