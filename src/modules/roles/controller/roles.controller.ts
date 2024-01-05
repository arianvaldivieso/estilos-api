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

@Controller('roles')
export class RolesController {
  private readonly logger: Logger = new Logger(RolesController.name);

  constructor(private readonly rolesService: RolesService) {}
}
