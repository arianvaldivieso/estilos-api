import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { StandardResponseInterceptor } from '@core/responses/standard-response.interceptor';

@Controller('province')
@UseInterceptors(StandardResponseInterceptor)
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Get()
  findAll(@Query('departamentId') departamentId: number) {
    return this.provinceService.findAllByDepartament(departamentId);
  }
}
