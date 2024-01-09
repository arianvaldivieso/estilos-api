import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateConfigDto } from '../../dto/config/create-config.dto';
import { ConfigService } from '../../services/config/config.service';
import { AuthGuard } from 'modules/auth/auth.guard';
import { StandardResponseInterceptor } from 'core/responses/standard-response.interceptor';

@Controller('admin/config')
@UseGuards(AuthGuard)
@UseInterceptors(StandardResponseInterceptor)
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Get(':module')
  findAll(@Param('module') module: string) {
    return this.configService.findAll(module);
  }

  @Post()
  create(@Body() createConfigDto: CreateConfigDto) {
    return this.configService.create(createConfigDto);
  }
}
