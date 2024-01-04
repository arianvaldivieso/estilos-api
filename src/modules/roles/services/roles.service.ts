import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateRolDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { from, lastValueFrom } from 'rxjs';
import { Role } from '../entities/role.entity';
import { ResponseMessages } from '@core/enums/responseMessages';
import { ResponseDto } from '@core/dtos/response.dto';
import { ErrorResponseDto } from '@core/dtos/errorResponse.dto';
import { UtilService } from 'modules/util/services/util.service';
import { errorsMessages } from '@core/dtos/errorsMessages';

@Injectable()
export class RolesService {
  private readonly logger: Logger = new Logger(RolesService.name);
  
  constructor(
    @InjectRepository(Role)
    private _rolesRepository: Repository<Role>,
    private utilService: UtilService,
  ) {}

  async getAllRoles(): Promise<ResponseDto<Role> | ErrorResponseDto> {
    try {
      this.logger.debug('GET_ALL_ROLES::INIT');
      const response = await this._rolesRepository.find();

      this.logger.debug('GET_ALL_ROLES::FINISH');
      return this.buildResponse(response, ResponseMessages.SUCCESSFUL);

    } catch (error) {
      return this.utilService.buildErrorResponse(
        HttpStatus.NOT_ACCEPTABLE,
        errorsMessages.ERROR,
      );
    }
  }

  async createRol(rol: CreateRolDto): Promise<ResponseDto<Role> | ErrorResponseDto> {

    try {
      this.logger.debug('CREATE_ROL::INIT');

      const newRol = new Role();
      newRol.name = rol.name;

      await this._rolesRepository.save(newRol);

      this.logger.debug('CREATE_ROL::FINISH');
      return this.buildResponse(newRol, ResponseMessages.SUCCESSFUL);

    } catch (error) {
      return this.utilService.buildErrorResponse(
        HttpStatus.NOT_ACCEPTABLE,
        errorsMessages.ERROR,
      );
    }

  }

  async getRolById(_id: string): Promise<ResponseDto<Role> | ErrorResponseDto> {
    try {
      this.logger.debug('GET_ROL_BY_ID::INIT');

      const response = await this._rolesRepository.findOne({ where: { id: _id['id'] }, relations: ['permissions'] });

      this.logger.debug('GET_ROL_BY_ID::FINISH');

      return this.buildResponse(response, ResponseMessages.SUCCESSFUL);

    } catch (error) {
      return this.utilService.buildErrorResponse(
        HttpStatus.NOT_ACCEPTABLE,
        errorsMessages.ERROR,
      );
    }
  }

  async findOneByName(name: string): Promise<any> {
    return await lastValueFrom(
      from(this._rolesRepository.findOne({ where: { name: name } })),
    );
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return { id, ...updateRoleDto };
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }

  buildResponse(rol: Role | Role[], message?: string): ResponseDto<Role> {
    this.logger.debug('BUILD_RESPONSE::INIT');
    const response: ResponseDto<Role> = {
      data: rol,
      statusCode: rol ? HttpStatus.OK : HttpStatus.NO_CONTENT,
      message: message || ResponseMessages.NOT_FOUND,
    };
    this.logger.debug('BUILD_RESPONSE::FINISH');
    return response;
  }
}
