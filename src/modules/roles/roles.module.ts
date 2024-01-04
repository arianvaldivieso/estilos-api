import { Module } from '@nestjs/common';
import { RolesService } from './services/roles.service';
import { RolesController } from './controller/roles.controller';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilService } from 'modules/util/services/util.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@core/enums/constants';
import { AuthService } from 'modules/auth/services/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiredTime },
    }),
  ],
  controllers: [RolesController],
  providers: [RolesService, UtilService, AuthService],
})
export class RolesModule {}
