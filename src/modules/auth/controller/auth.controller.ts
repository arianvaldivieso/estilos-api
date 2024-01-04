import { Body, Controller, Logger, Post, Req } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/auth.dto';
import { LoginResponseDto } from '../dto/loginResponse.dto';
import { LoginWithSocialNetworkDto } from '../dto/loginWithSocialNetworks.dto';
import { ResetPasswordDto } from '../dto/resetPassword.dto';
import { responseMessages } from '../enum/responseMessages';
import { AuthService } from '../services/auth.service';
import { ErrorResponseDto } from '@core/dtos/errorResponse.dto';

@Controller('accounts')
@ApiTags(AuthController.name)

export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  constructor(private service: AuthService) { }

  @ApiBearerAuth()
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiBadRequestResponse({
    description: responseMessages.LOGIN_ERROR,
    type: ErrorResponseDto,
  })
  async login(@Body() authUserDto: LoginDto): Promise<string | LoginResponseDto | ErrorResponseDto> {
    return await this.service.login(authUserDto);
  }

  async resetPassword(
    @Req() req,
    @Body() data: ResetPasswordDto,
  ): Promise<void | ErrorResponseDto> {
    try {
      this.logger.log(`RESET_PASSWORD::INIT`);
      const response: void | ErrorResponseDto =
        await this.service.resetPassword(req.userId, data);
      this.logger.log(`RESET_PASSWORD::FINISH`);
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new Error(JSON.stringify(error));
    }
  }

  async loginWithSocialNetwork(
    @Body() user: LoginWithSocialNetworkDto,
  ): Promise<LoginResponseDto | ErrorResponseDto> {
    try {
      this.logger.log(`LOGIN_WITH_SOCIAL_NETWORK::INIT`);
      const response: LoginResponseDto | ErrorResponseDto =
        await this.service.loginWithSocialNetwork(user);
      this.logger.log(`LOGIN_WITH_SOCIAL_NETWORK::FINISH`);
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new Error(JSON.stringify(error));
    }
  }
}
