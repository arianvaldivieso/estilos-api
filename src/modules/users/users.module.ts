// users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'modules/roles/entities/role.entity';
import { RolesService } from 'modules/roles/services/roles.service';
import { RolesModule } from 'modules/roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
