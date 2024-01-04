
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilModule } from '../util/util.module';
import { jwtConstants } from '@core/enums/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiredTime },
    }),
    forwardRef(() => UtilModule)
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
  ],
  exports: [TypeOrmModule, AuthService],
})
export class AuthModule { }
