import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Province } from './entities/province.entity';
import { Repository } from 'typeorm';
import { from, lastValueFrom } from 'rxjs';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
  ) {}

  async findAllByDepartament(departamentId: number) {
    return await lastValueFrom(
      from(
        this.provinceRepository.find({
          where: { departament: { id: departamentId } },
        }),
      ),
    );
  }
}
