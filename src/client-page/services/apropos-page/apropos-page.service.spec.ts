import { Test, TestingModule } from '@nestjs/testing';
import { AproposPageService } from './apropos-page.service';

describe('AproposPageService', () => {
  let service: AproposPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AproposPageService],
    }).compile();

    service = module.get<AproposPageService>(AproposPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
