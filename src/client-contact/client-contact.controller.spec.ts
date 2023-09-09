import { Test, TestingModule } from '@nestjs/testing';
import { ClientContactController } from './client-contact.controller';
import { ClientContactService } from './client-contact.service';

describe('ClientContactController', () => {
  let controller: ClientContactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientContactController],
      providers: [ClientContactService],
    }).compile();

    controller = module.get<ClientContactController>(ClientContactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
