import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/entities/role.entity';
import { IsEmailAlreadyExistConstraint } from 'src/@core/validations/user-email.validation';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService, RolesService, IsEmailAlreadyExistConstraint],
})
export class UsersModule {}
