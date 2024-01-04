// users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'modules/roles/entities/role.entity';
import { RolesService } from 'modules/roles/services/roles.service';
import { AuthService } from 'modules/auth/services/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService, RolesService, AuthService],
})
export class UsersModule {}
