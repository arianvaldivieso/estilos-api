import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '../entities/role.entity';
import { from, lastValueFrom } from 'rxjs';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private _rolesRepository: Repository<Role>,
  ) {}

  async findOneByName(name: string): Promise<Role> {
    return await lastValueFrom(
      from(
        this._rolesRepository.findOneBy({
          name: name,
        }),
      ),
    );
  }
}
