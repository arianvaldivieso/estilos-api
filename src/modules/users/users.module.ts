// users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesModule } from 'modules/roles/roles.module';
import { Otp } from './entities/otp.entity';
import { OtpServiceService } from './services/otp.service.service';
import { TwilioService } from './services/twilio.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Otp]), RolesModule],
  controllers: [UsersController],
  providers: [UsersService, OtpServiceService, TwilioService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
