import { Module } from '@nestjs/common';
import { DepartamentService } from './departament.service';
import { DepartamentController } from './departament.controller';

@Module({
  controllers: [DepartamentController],
  providers: [DepartamentService],
})
export class DepartamentModule {}
