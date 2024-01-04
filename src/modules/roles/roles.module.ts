import { Module } from '@nestjs/common';
import { RolesService } from './services/roles.service';
import { RolesController } from './controller/roles.controller';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@core/enums/constants';
import { AuthService } from 'modules/auth/services/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesService, AuthService],
})
export class RolesModule {}
