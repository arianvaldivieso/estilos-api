import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { from, lastValueFrom } from 'rxjs';
import { Role } from './entities/role.entity';
import { RoleType } from 'src/@core/enums/role-type.enum';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private _rolesRepository: Repository<Role>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  findAll() {
    return `This action returns all roles`;
  }

  async findOneByName(name: string): Promise<any> {
    const roleType = RoleType[name.toUpperCase() as keyof typeof RoleType];

    if (!roleType) {
      throw new Error(`Invalid role name: ${name}`);
    }

    return await lastValueFrom(
      from(this._rolesRepository.findOne({ where: { name: roleType } })),
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
