import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role } from 'modules/roles/entities/role.entity';
import { Logger } from '@nestjs/common';
import { roles } from '@core/seeders-data/roles.data';

export default class RolesSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(Role);

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
