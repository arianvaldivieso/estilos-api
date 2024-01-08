import { Test, TestingModule } from '@nestjs/testing';
import { ApiClientStylesService } from './api-client-styles.service';

describe('ApiClientStylesService', () => {
  let service: ApiClientStylesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiClientStylesService],
    }).compile();

    service = module.get<ApiClientStylesService>(ApiClientStylesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
