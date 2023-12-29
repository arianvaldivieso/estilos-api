import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { from, lastValueFrom } from 'rxjs';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private _rolesRepository: Repository<Role>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    return createRoleDto;
  }

  findAll() {
    return `This action returns all roles`;
  }

  async findOneByName(name: string): Promise<any> {
    return await lastValueFrom(
      from(this._rolesRepository.findOne({ where: { name: name } })),
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return { id, ...updateRoleDto };
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
