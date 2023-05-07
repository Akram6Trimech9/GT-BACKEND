import { Test, TestingModule } from '@nestjs/testing';
import { ServicesPageService } from './services-page.service';

describe('ServicesPageService', () => {
  let service: ServicesPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicesPageService],
    }).compile();

    service = module.get<ServicesPageService>(ServicesPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
