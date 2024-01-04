import { Injectable } from '@nestjs/common';
import { CreateDepartamentDto } from './dto/create-departament.dto';
import { UpdateDepartamentDto } from './dto/update-departament.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Departament } from './entities/departament.entity';
import { from, lastValueFrom } from 'rxjs';

@Injectable()
export class DepartamentService {
  constructor(
    @InjectRepository(Departament)
    private _departamentsRepository: Repository<Departament>,
  ) {}

  create(createDepartamentDto: CreateDepartamentDto) {
    return 'This action adds a new departament';
  }

  async findAll(): Promise<Departament[]> {
    return await lastValueFrom(from(this._departamentsRepository.find()));
  }

  findOne(id: number) {
    return `This action returns a #${id} departament`;
  }

  update(id: number, updateDepartamentDto: UpdateDepartamentDto) {
    return `This action updates a #${id} departament`;
  }

  remove(id: number) {
    return `This action removes a #${id} departament`;
  }
}
