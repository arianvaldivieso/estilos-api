import { Body, Controller, Get, Logger, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErrorResponseDto } from '@core/dtos/errorResponse.dto';
import { ResponseDto } from '@core/dtos/response.dto';
import { Role } from '../entities/role.entity';
import { JwtGuard } from 'guards/jwt.guard';
import { CreateRolDto } from '../dto/create-role.dto';

@Controller('roles')
@ApiTags(RolesController.name)

export class RolesController {
  private readonly logger: Logger = new Logger(RolesController.name);
  
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get()
  async getAllRoles(@Param() select?: boolean): Promise<ResponseDto<Role> | ErrorResponseDto> {
    this.logger.debug('GET_ALL_ROLES::INIT');
    const response: ResponseDto<Role> | ErrorResponseDto =
      await this.rolesService.getAllRoles();
    this.logger.debug('GET_ALL_ROLES::FINISH');
    return response;
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Post()
  async createRol(@Body() createRolDto: CreateRolDto): Promise<ResponseDto<Role> | ErrorResponseDto> {
    this.logger.debug('CREATE_ROL::INIT');
    const response: ResponseDto<Role> | ErrorResponseDto = await this.rolesService.createRol(createRolDto);
    this.logger.debug('CREATE_ROL::FINISH');
    return response;
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get(':id')
  async getRolById(@Req() req, @Param() id: string): Promise<ResponseDto<Role> | ErrorResponseDto> {
    this.logger.debug('GET_ROL_BY_ID::INIT');
    const response: ResponseDto<Role> | ErrorResponseDto = await this.rolesService.getRolById(id);
    this.logger.debug('GET_ROL_BY_ID::FINISH');
    return response;
  }
}
