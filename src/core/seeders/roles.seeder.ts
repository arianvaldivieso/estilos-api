import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role } from 'modules/roles/entities/role.entity';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { roles } from 'core/seeders/seeders-data/roles.data';

@Injectable()

export default class RolesSeeder implements Seeder {

  constructor(private dataSource: DataSource) { }

  public async run(): Promise<any> {
    const repository = this.dataSource.getRepository(Role);
    const data = roles;
    
    for (let ind = 0; ind < data.length; ind++) {
      const rol = await repository.findOneBy({ name: data[ind].name });

      if (!rol) {
        try {
          const newRole = repository.create(data[ind]);
          await repository.save(newRole);
        } catch (error) {
          Logger.error(error);
        }
      }
    }
  }
}
