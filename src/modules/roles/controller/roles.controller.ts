import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDto } from '@core/dtos/errorResponse.dto';
import { ResponseDto } from '@core/dtos/response.dto';
import { Role } from '../entities/role.entity';
import { CreateRolDto } from '../dto/create-role.dto';

@Controller('roles')
@ApiTags(RolesController.name)
export class RolesController {
  private readonly logger: Logger = new Logger(RolesController.name);

  constructor(private readonly rolesService: RolesService) {}
}
