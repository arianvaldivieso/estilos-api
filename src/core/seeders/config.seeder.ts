import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { globalConfig } from './seeders-data/config.data';
import { GlobalConfig } from 'modules/admin/entities/global-config.entity';
@Injectable()
export default class ConfigSeeder implements Seeder {
  constructor(private dataSource: DataSource) { }

  public async run(): Promise<any> {
    const repository = this.dataSource.getRepository(GlobalConfig);

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
