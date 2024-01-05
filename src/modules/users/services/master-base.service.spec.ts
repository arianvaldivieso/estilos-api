import { Test, TestingModule } from '@nestjs/testing';
import { MasterBaseService } from './master-base.service';

describe('MasterBaseService', () => {
  let service: MasterBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MasterBaseService],
    }).compile();

    service = module.get<MasterBaseService>(MasterBaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
