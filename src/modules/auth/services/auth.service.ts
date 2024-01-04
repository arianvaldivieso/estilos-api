import { LoginDto } from '../dto/auth.dto';
import { compare, hashSync } from 'bcryptjs';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LoginResponseDto } from '../dto/loginResponse.dto';
import { TokenDto } from '../dto/token.dto';
import { responseMessages } from '../enum/responseMessages';
import { LoginWithSocialNetworkDto } from '../dto/loginWithSocialNetworks.dto';
import { ResetPasswordDto } from '../dto/resetPassword.dto';
import { errorsMessages } from '../enum/errorsMessages';
import { UtilService } from 'modules/util/services/util.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'modules/users/entities/user.entity';
import { ErrorResponseDto } from '@core/dtos/errorResponse.dto';
import { jwtConstants } from '@core/enums/constants';

@Injectable()
export class AuthService {
  //repositories
  userRepository: any;
  loginHistoryRepository: any;

  private readonly logger: Logger = new Logger('AccountController');

  constructor(
    private utilService: UtilService,
    private jwtService: JwtService,
    private dataSource: DataSource,
  ) {
    this.userRepository = dataSource.getRepository(User);
  }

  async login(authUserDto: LoginDto): Promise<LoginResponseDto | ErrorResponseDto> {
    try {
      this.logger.log(`LOGIN::INIT`);
      const user: User = await this.utilService.getUserByEmail(authUserDto.email);
  
      if (!user) {
        return this.utilService.buildErrorResponse(
          HttpStatus.NOT_FOUND,
          errorsMessages.EMAIL_NOT_FOUND,
        );
      }
  
      const isPasswordEqual: boolean = await compare(authUserDto.password, user.password);

      user.token = this.jwtService.sign({ email: user.email, password: user.password }, { privateKey: jwtConstants.secret });
  
      //delete password
      delete user.password;
  
      let response = this.buildLoginResponse(isPasswordEqual, user);
  
      this.logger.log(`LOGIN::FINISH`);
  
      return response;

    } catch (errs) {
      
    }
   
  }

  async loginWithSocialNetwork(
    user: LoginWithSocialNetworkDto,
  ): Promise<LoginResponseDto | ErrorResponseDto> {
    this.logger.log(`LOGIN_WITH_SOCIAL_NETWORK::INIT`);
    const userFound: User = await this.utilService.getUserByEmail(user.email);

    if (!userFound) {
      return this.utilService.buildErrorResponse(404, errorsMessages.EMAIL_NOT_FOUND);
    }

    userFound.token = this.jwtService.sign({
      userId: userFound.id,
    });

    const response = this.buildLoginResponse(true, userFound);
    this.logger.log(`LOGIN_WITH_SOCIAL_NETWORK::FINISH`);
    return response;
  }

  buildLoginResponse(
    isPasswordEqual: boolean,
    user: User
  ): Promise<LoginResponseDto | ErrorResponseDto> {
    this.logger.log(`BUILD_LOGIN_RESPONSE::INIT`);
    let response;
    if (!isPasswordEqual) {
      response: ErrorResponseDto;
      response = this.utilService.buildErrorResponse(
        HttpStatus.UNAUTHORIZED,
        errorsMessages.USER_PASSWORD_INVALID,
      );
    } else {
      response = {
        statusCode: HttpStatus.OK,
        message: responseMessages.USER_LOGIN_SUCESS,
        data: user
      };
    }
    this.logger.log(`BUILD_LOGIN_RESPONSE::FINISH`);
    return response;
  }

  async validateUserToken(token: TokenDto): Promise<TokenDto> {
    this.logger.log(`VALIDATE_USER_TOKEN::INIT`);
    let response;

    try {
      this.logger.log(`VALIDATE_USER_TOKEN::INIT token: ${token}`);
      this.logger.log(`VALIDATE_USER_TOKEN::INIT token.bearerToken: ${token.bearerToken}`);

      token.bearerToken = token.bearerToken.replace('Bearer ', '');
      this.logger.log(`VALIDATE_USER_TOKEN::INIT token.bearerToken: ${token.bearerToken}`);
      response = this.jwtService.verify(token.bearerToken, {
        secret: jwtConstants.secret,
        ignoreExpiration: true
      });
      this.logger.log(`VALIDATE_USER_TOKEN::INIT response: ${response}`);

      token.userId = response.userId;

      const userFound = await this.utilService.getUserById(token.userId);

      if (!userFound) {
        response = this.utilService.buildErrorResponse(
          HttpStatus.NOT_FOUND,
          errorsMessages.USER_PASSWORD_INVALID,
        );
      }
      this.logger.log(`VALIDATE_USER_TOKEN::FINISH`);
      response = token;
      return token;

    } catch (error) {
      this.logger.error(error);
      response = this.utilService.buildErrorResponse(
        HttpStatus.UNAUTHORIZED,
        errorsMessages.TOKEN_EXPIRED,
      );
    }
    return response;
  }

  async resetPassword(
    id: string,
    data: ResetPasswordDto,
  ): Promise<void | ErrorResponseDto> {
    this.logger.log(`RESET_PASSWORD::INIT`);

    let response: undefined | ErrorResponseDto;
    const userFound: User = await this.utilService.getUserById(id);
    if (!userFound) {
      response = this.utilService.buildErrorResponse(
        HttpStatus.NOT_FOUND,
        errorsMessages.USER_PASSWORD_INVALID,
      );
    } else {
      userFound.password = await hashSync(data.password);
      let response = await this.userRepository.update({
        id: id,
      }, userFound).then(resp => resp.raw[0]);
    }
    this.logger.log(`RESET_PASSWORD::FINISH`);

    return response;
  }
}
