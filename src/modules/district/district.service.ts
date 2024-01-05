import { Injectable } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { from, lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { District } from './entities/district.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {}

  async findAllByProvince(provinceId: number) {
    return await lastValueFrom(
      from(
        this.districtRepository.find({
          where: { province: { id: provinceId } },
        }),
      ),
    );
  }
}
