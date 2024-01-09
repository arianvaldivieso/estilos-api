import { Test, TestingModule } from '@nestjs/testing';
import { PageAdminService } from './page-admin.service';

describe('PageAdminService', () => {
  let service: PageAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PageAdminService],
    }).compile();

    service = module.get<PageAdminService>(PageAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
