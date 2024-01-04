import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '../entities/role.entity';
import { from, lastValueFrom } from 'rxjs';

@Injectable()
export class RolesService {
  private readonly logger: Logger = new Logger(RolesService.name);

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
