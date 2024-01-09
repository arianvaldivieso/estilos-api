import { Test, TestingModule } from '@nestjs/testing';
import { RoleAdminService } from './role-admin.service';

describe('RoleService', () => {
  let service: RoleAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleAdminService],
    }).compile();

    service = module.get<RoleAdminService>(RoleAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
