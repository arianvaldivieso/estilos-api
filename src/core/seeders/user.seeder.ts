import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { users } from './seeders-data/users.data';
import { User } from 'modules/users/entities/user.entity';
import { Role } from 'modules/roles/entities/role.entity';
import { RoleType } from 'core/enums/role-type.enum';

@Injectable()
export default class UserSeeder implements Seeder {
  constructor(private dataSource: DataSource) {}

  public async run(): Promise<any> {
    const repository = this.dataSource.getRepository(User);
    const repositoryRol = this.dataSource.getRepository(Role);
    const data = users;
    const password = await bcrypt.hash('12345678', 10);
    const rol = await repositoryRol.findOneBy({ name: RoleType.USER });

    for (let ind = 0; ind < data.length; ind++) {
      const user = await repository.findOneBy({ email: data[ind].email });

      if (!user) {
        try {
          data[ind].password = password;
          data[ind].birthdate = new Date(data[ind].birthdate).toString();
          data[ind].rol = rol;

          const newRole = repository.create(data[ind]);
          await repository.save(newRole);
        } catch (error) {
          Logger.error(error);
        }
      }
    }
  }
}
