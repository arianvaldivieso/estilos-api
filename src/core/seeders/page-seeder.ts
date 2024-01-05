import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { pagesData } from './seeders-data/pages.data';
import { Page } from 'modules/admin/entities/page.entity';

export default class PageSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(Page);

    const data = pagesData;
    for (let ind = 0; ind < data.length; ind++) {
      const exist = await repository.findOneBy({ slug: data[ind].slug });

      if (!exist) {
        try {
          const newItem = repository.create(data[ind]);
          await repository.save(newItem);
        } catch (error) {
          Logger.error(error);
        }
      }
    }
  }
}
