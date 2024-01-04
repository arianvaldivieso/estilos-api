import { Module } from '@nestjs/common';
import { UtilService } from './services/util.service';
import { UtilController } from './controller/util.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature(),
  ],
  controllers: [
    UtilController
  ],
  providers: [
    UtilService, 
  ],
  exports: [TypeOrmModule, UtilService],
})
export class UtilModule {}
