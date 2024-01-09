import { Injectable, Logger } from '@nestjs/common';
import RolesSeeder from '../roles.seeder';
import PageSeeder from '../page-seeder';
import DepartamentSeeder from '../departament.seeder';
import UserSeeder from '../user.seeder';
import ConfigSeeder from '../config.seeder';

@Injectable()
export class SeedingService {
  constructor(
    private readonly rolesSeeder: RolesSeeder,
    private readonly pageSeeder: PageSeeder,
    private readonly departamentSeeder: DepartamentSeeder,
    private readonly userSeeder: UserSeeder,
    private readonly configSeeder: ConfigSeeder
  ) {}

  async seed(): Promise<void> {

    // Replace with your own seeds
    await Promise.all([
      this.rolesSeeder.run(),
      this.pageSeeder.run(),
      this.departamentSeeder.run(),
      this.userSeeder.run(),
      this.configSeeder.run()
    ]);

  }
}