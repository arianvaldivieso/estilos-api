import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role } from 'roles/entities/role.entity';
import { roles } from '@core/dummy/roles.dummy';

export default class RolesSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(Role);

    const data = roles;

    for (let ind = 0; ind < data.length; ind++) {
      const rol = await repository.findOneBy({ name: data[ind].name });

      // Insert only one record with this username.
      if (!rol) {
        await repository.insert([rol]);
      }
    }
  }
}
