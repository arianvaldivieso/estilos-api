// users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'modules/roles/entities/role.entity';
import { RolesService } from 'modules/roles/services/roles.service';
import { UtilService } from 'modules/util/services/util.service';
import { AuthService } from 'modules/auth/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@core/enums/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiredTime },
    }),
  ],
  controllers: [
    UsersController,
  ],
  providers: [
    UsersService, 
    RolesService,
    AuthService,
    UtilService,
  ],
})
export class UsersModule {}
