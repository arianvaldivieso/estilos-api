import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entities/page.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Page])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
