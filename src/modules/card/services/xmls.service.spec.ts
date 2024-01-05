import { Test, TestingModule } from '@nestjs/testing';
import { XmlsService } from './xmls.service';

describe('XmlsService', () => {
  let service: XmlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [XmlsService],
    }).compile();

    service = module.get<XmlsService>(XmlsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
