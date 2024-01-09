import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common/decorators/modules';
import { UsersModule } from 'modules/users/users.module';
import { RolesModule } from 'modules/roles/roles.module';
import { DepartamentModule } from './modules/departament/departament.module';
import { ProvinceModule } from './modules/province/province.module';
import { DistrictModule } from './modules/district/district.module';
import { AuthModule } from 'modules/auth/auth.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { AdminModule } from './modules/admin/admin.module';
import { FaqModule } from './modules/faq/faq.module';
import { ContactModule } from './modules/contact/contact.module';
import { CardModule } from './modules/card/card.module';
import { OnApplicationBootstrap } from '@nestjs/common';
import { SeedingService } from 'core/seeders/services/seedingService';
import RolesSeeder from 'core/seeders/roles.seeder';
import PageSeeder from 'core/seeders/page-seeder';
import DepartamentSeeder from 'core/seeders/departament.seeder';
import UserSeeder from 'core/seeders/user.seeder';
import ConfigSeeder from 'core/seeders/config.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    RolesModule,
    DepartamentModule,
    ProvinceModule,
    DistrictModule,
    AuthModule,
    TransactionModule,
    AdminModule,
    FaqModule,
    ContactModule,
    CardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SeedingService,
    RolesSeeder,
    PageSeeder,
    DepartamentSeeder,
    UserSeeder,
    ConfigSeeder
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seedingService: SeedingService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedingService.seed();
  }
}
