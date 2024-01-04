import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import {
  departaments,
  districts,
  provinces,
} from '@core/seeders/seeders-data/departament.data';
import { Departament } from 'modules/departament/entities/departament.entity';
import { Province } from 'modules/province/entities/province.entity';
import { District } from 'modules/district/entities/district.entity';

export default class DepartamentSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    /** Departaments */

    const departamentRepository = dataSource.getRepository(Departament);

    for (let ind = 0; ind < departaments.length; ind++) {
      const rol = await departamentRepository.findOneBy({
        name: departaments[ind].name,
      });

      if (!rol) {
        try {
          const newDepartament = departamentRepository.create(
            departaments[ind],
          );
          await departamentRepository.save(newDepartament);
        } catch (error) {
          Logger.error(error);
        }
      }
    }

    /** Provinces */

    const provinceRepository = dataSource.getRepository(Province);

    for (let ind = 0; ind < provinces.length; ind++) {
      const province = await provinceRepository.findOneBy({
        name: provinces[ind].name,
      });

      if (!province) {
        province = {
          ...provinces[ind],
        };

        try {
          const newprovince = provinceRepository.create(provinces[ind]);
          await provinceRepository.save(newprovince);
        } catch (error) {
          Logger.error(error);
        }
      }
    }

    /** districts */

    const districtRepository = dataSource.getRepository(District);

    for (let ind = 0; ind < districts.length; ind++) {
      const rol = await districtRepository.findOneBy({
        name: districts[ind].name,
      });

      if (!rol) {
        try {
          const newprovince = districtRepository.create(districts[ind]);
          await districtRepository.save(newprovince);
        } catch (error) {
          Logger.error(error);
        }
      }
    }
  }
}
