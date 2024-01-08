import { StandardResponseInterceptor } from 'core/responses/standard-response.interceptor';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from 'modules/users/services/users.service';
import { ValidateDto } from './dto/validate.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { OtpService } from 'modules/users/services/otp.service';
import { ValidateOtpDto } from './dto/validate-otp.dto';

@Controller('auth')
@UseInterceptors(StandardResponseInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly otpService: OtpService,
  ) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    const user = this.userService.create(createUserDto);
    return user;
  }

  @Post('validate')
  validate(@Body() validateDto: ValidateDto) {
    const user = this.userService.validateUser(validateDto);
    return user;
  }

  @Post('validate-otp')
  validateOtp(@Body() validateOtp: ValidateOtpDto) {
    return this.otpService.validateOtp(validateOtp.userId, validateOtp.otp);
  }

  @Post('resend-otp')
  async resendOtp(@Body() validateOtp: ResendOtpDto) {
    await this.otpService.resendOtp(validateOtp.userId);

    return 'ok';
  }

  @Post()
  login(@Body() createUserDto: LoginDto) {
    return this.authService.signIn(
      createUserDto.documentNumber,
      createUserDto.documentType,
      '12345678',
    );
  }
}
