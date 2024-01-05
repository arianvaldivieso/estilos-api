import { Test, TestingModule } from '@nestjs/testing';
import { OtpServiceService } from './otp.service.service';

describe('OtpServiceService', () => {
  let service: OtpServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtpServiceService],
    }).compile();

    service = module.get<OtpServiceService>(OtpServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
