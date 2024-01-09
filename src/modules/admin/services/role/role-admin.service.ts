import { Injectable } from '@nestjs/common';
import { RoleAdminRepository } from 'modules/admin/repositories/role-admin-repository/role-admin-repository';
import { Role } from 'modules/roles/entities/role.entity';
import { from, lastValueFrom } from 'rxjs';

@Injectable()
export class RoleAdminService {
  constructor(private roleAdminRepository: RoleAdminRepository) {}

  /**
   * Retrieves all roles for administrators.
   * @returns {Promise<Role[]>} - Promise resolved with an array of roles for administrators.
   */
  async findAll(): Promise<Role[]> {
    try {
      const roles: Role[] = await lastValueFrom(
        from(this.roleAdminRepository.find()),
      );
      return roles;
    } catch (error) {
      throw new Error('Failed to fetch roles for administrators.');
    }
  }
}
