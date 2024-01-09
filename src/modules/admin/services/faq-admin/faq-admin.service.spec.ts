import { Test, TestingModule } from '@nestjs/testing';
import { FaqAdminService } from './faq-admin.service';

describe('FaqAdminService', () => {
  let service: FaqAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FaqAdminService],
    }).compile();

    service = module.get<FaqAdminService>(FaqAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
