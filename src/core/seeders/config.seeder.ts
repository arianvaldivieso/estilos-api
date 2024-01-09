import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { globalConfig } from './seeders-data/config.data';
import { GlobalConfig } from 'modules/admin/entities/global-config.entity';

export default class ConfigSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(GlobalConfig);

    const data = globalConfig;
    for (let ind = 0; ind < data.length; ind++) {
      const rol = await repository.findOneBy({
        module: data[ind].module,
        key: data[ind].key,
      });

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
