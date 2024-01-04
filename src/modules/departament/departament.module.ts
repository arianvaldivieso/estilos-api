import { Module } from '@nestjs/common';
import { DepartamentService } from './departament.service';
import { DepartamentController } from './departament.controller';
import { Departament } from './entities/departament.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Departament])],
  controllers: [DepartamentController],
  providers: [DepartamentService],
})
export class DepartamentModule {}
