import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'modules/roles/entities/role.entity';
import { Repository } from 'typeorm';

export class RoleAdminRepository extends Repository<Role> {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {
    super(
      roleRepository.target,
      roleRepository.manager,
      roleRepository.queryRunner,
    );
  }
}
