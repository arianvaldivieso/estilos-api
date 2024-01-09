import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigController } from './config/config.controller';
import { GlobalConfig } from './entities/global-config.entity';
import { UsersModule } from 'modules/users/users.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [TypeOrmModule.forFeature([GlobalConfig]), UsersModule],
  controllers: [ConfigController],
  providers: [ConfigService],
})
export class AdminModule {}
