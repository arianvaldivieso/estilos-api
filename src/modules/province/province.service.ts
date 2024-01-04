import { Injectable } from '@nestjs/common';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { Province } from './entities/province.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { from, lastValueFrom } from 'rxjs';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private _provincesRepository: Repository<Province>,
  ) {}
  create(createProvinceDto: CreateProvinceDto) {
    return 'This action adds a new province';
  }

  async findAll(): Promise<Province[]> {
    return await lastValueFrom(from(this._provincesRepository.find()));
  }

  findOne(id: number) {
    return `This action returns a #${id} province`;
  }

  update(id: number, updateProvinceDto: UpdateProvinceDto) {
    return `This action updates a #${id} province`;
  }

  remove(id: number) {
    return `This action removes a #${id} province`;
  }
}
