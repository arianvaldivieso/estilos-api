import { ErrorResponseDto } from '@core/dtos/errorResponse.dto';
import { errorsMessages } from '@core/dtos/errorsMessages';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'modules/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UtilService {
  //repositories
  userRepository: any;
  studentRepository: any;
  loginHistoryRepository: any;

  private readonly logger: Logger = new Logger(UtilService.name);

  constructor() {}

  buildErrorResponse(code: number, message: string): ErrorResponseDto {
    const response = new ErrorResponseDto();
    response.isError = true;
    response.code = code;
    response.message = message;
    return response;
  }

  async getUserById(userId: string): Promise<User> {
    this.logger.log(`GET_USER_BY_ID::INIT`);
    const response = await this.userRepository.findOne({
      where: { id: userId },
    });
    this.logger.log(`GET_USER_BY_ID::INIT response: ${response}`);

    this.logger.log(`GET_USER_BY_ID::FINISH`);
    return response;
  }

  async getUserByEmail(email: string): Promise<User> {
    this.logger.log(`GET_USER_BY_EMAIL::INIT`);

    const response = await this.userRepository.findOne({
        where: { email },
        select: {
            password: true,
            id: true,
            name: true,
            lastName: true,
            phone: true,
            documentNumber: true,
            typeDocument: true,
            address: true,
            dateOfBirth: true,
            email: true,
            departament: true,
            active: true,
            passwordResetToken: true,
            createdAt: true,
            updateAt: true,
        },
    });

    this.logger.log(`GET_USER_BY_EMAIL::FINISH`);
    return response;
}

  buildErrorResponseGuard(object: ErrorResponseDto) {
    this.logger.log(`BUILD_ERROR_RESPONSE: INIT`);
    if (object.code === HttpStatus.BAD_REQUEST) {
      return new BadRequestException(object.message);
    }
    if (object.code === HttpStatus.UNAUTHORIZED) {
      return new UnauthorizedException(object.message);
    }
    if (object.code === HttpStatus.NOT_FOUND) {
      return new NotFoundException(object.message);
    }
    this.logger.log(`BUILD_ERROR_RESPONSE: FINISH`);
  }
}
