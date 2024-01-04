import { Injectable } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { District } from './entities/district.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from, lastValueFrom } from 'rxjs';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private _districtsRepository: Repository<District>,
  ) {}

  create(createDistrictDto: CreateDistrictDto) {
    return 'This action adds a new district';
  }

  async findAll(): Promise<District[]> {
    return await lastValueFrom(from(this._districtsRepository.find()));
  }

  findOne(id: number) {
    return `This action returns a #${id} district`;
  }

  update(id: number, updateDistrictDto: UpdateDistrictDto) {
    return `This action updates a #${id} district`;
  }

  remove(id: number) {
    return `This action removes a #${id} district`;
  }
}
