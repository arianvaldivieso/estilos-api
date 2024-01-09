import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { StandardResponseInterceptor } from 'core/responses/standard-response.interceptor';
import { AuthGuard } from 'modules/auth/auth.guard';
import { RoleAdminService } from '../../services/role/role-admin.service';
import { Role } from 'modules/roles/entities/role.entity';

@Controller('admin/roles')
@UseGuards(AuthGuard)
@UseInterceptors(StandardResponseInterceptor)
export class RoleController {
  constructor(private roleService: RoleAdminService) {}

  /**
   * Retrieves all roles for administrators.
   * @returns {Promise<Role[]>} - Promise resolved with an array of roles for administrators.
   */
  @Get()
  async findAll(): Promise<Role[]> {
    return await this.roleService.findAll();
  }
}
