import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { DistrictService } from './district.service';
import { StandardResponseInterceptor } from '@core/responses/standard-response.interceptor';

@Controller('district')
@UseInterceptors(StandardResponseInterceptor)
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get()
  findAll(@Query('provinceId') provinceId: number) {
    return this.districtService.findAllByProvince(provinceId);
  }
}
