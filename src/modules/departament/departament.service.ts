import { Injectable } from '@nestjs/common';
import { CreateDepartamentDto } from './dto/create-departament.dto';
import { UpdateDepartamentDto } from './dto/update-departament.dto';

@Injectable()
export class DepartamentService {
  create(createDepartamentDto: CreateDepartamentDto) {
    return 'This action adds a new departament';
  }

  findAll() {
    return `This action returns all departament`;
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
