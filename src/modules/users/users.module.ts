// users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesModule } from 'modules/roles/roles.module';
import { Otp } from './entities/otp.entity';
import { OtpService } from './services/otp.service';
import { TwilioService } from './services/twilio.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Otp]), RolesModule],
  controllers: [UsersController],
  providers: [UsersService, OtpService, TwilioService],
  exports: [TypeOrmModule, UsersService, OtpService],
})
export class UsersModule {}
