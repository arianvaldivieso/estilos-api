import { Test, TestingModule } from '@nestjs/testing';
import { ApiStylesService } from './api-styles.service';

describe('ApiStylesService', () => {
  let service: ApiStylesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiStylesService],
    }).compile();

    service = module.get<ApiStylesService>(ApiStylesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
