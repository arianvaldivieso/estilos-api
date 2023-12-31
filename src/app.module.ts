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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
