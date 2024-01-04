// users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'modules/roles/entities/role.entity';
import { UsersController } from 'modules/users/controller/users.controller';
import { UsersService } from 'modules/users/services/users.service';
import { RolesService } from 'modules/roles/services/roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService, RolesService],
})
export class UsersModule {}
