import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { DepartamentService } from './departament.service';
import { CreateDepartamentDto } from './dto/create-departament.dto';
import { UpdateDepartamentDto } from './dto/update-departament.dto';
import { StandardResponseInterceptor } from 'core/responses/standard-response.interceptor';

@Controller('departament')
@UseInterceptors(StandardResponseInterceptor)
export class DepartamentController {
  constructor(private readonly _departamentService: DepartamentService) {}

  @Post()
  create(@Body() createDepartamentDto: CreateDepartamentDto) {
    return this._departamentService.create(createDepartamentDto);
  }

  @Get()
  async findAll() {
    return await this._departamentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this._departamentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDepartamentDto: UpdateDepartamentDto,
  ) {
    return this._departamentService.update(+id, updateDepartamentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._departamentService.remove(+id);
  }
}
