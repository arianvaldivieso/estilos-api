import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigController } from './controllers/config/config.controller';
import { GlobalConfig } from './entities/global-config.entity';
import { UsersModule } from 'modules/users/users.module';
import { ConfigService } from './services/config/config.service';
import { RoleController } from './controllers/role/role.controller';
import { RoleAdminService } from './services/role/role-admin.service';
import { RoleAdminRepository } from './repositories/role-admin-repository/role-admin-repository';
import { Role } from 'modules/roles/entities/role.entity';
import { PageController } from './controllers/page/page.controller';
import { PageAdminService } from './services/page-admin/page-admin.service';
import { PageAdminRepository } from './repositories/page-admin-repository/page-admin-repository';
import { Page } from 'modules/page/entities/page.entity';
import { FaqAdminService } from './services/faq-admin/faq-admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([GlobalConfig, Role, Page]), UsersModule],
  controllers: [ConfigController, RoleController, PageController],
  providers: [
    ConfigService,
    RoleAdminService,
    PageAdminService,
    RoleAdminRepository,
    PageAdminRepository,
    FaqAdminService,
  ],
})
export class AdminModule {}
