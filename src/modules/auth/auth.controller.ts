import { StandardResponseInterceptor } from '@core/responses/standard-response.interceptor';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from 'modules/users/services/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _userService: UsersService,
  ) {}

  @Post('register')
  @UseInterceptors(StandardResponseInterceptor)
  create(@Body() createUserDto: CreateUserDto) {
    const user = this._userService.create(createUserDto);
    return user;
  }

  @Post()
  @UseInterceptors(StandardResponseInterceptor)
  login(@Body() createUserDto: LoginDto) {
    return this._authService.signIn(
      createUserDto.documentNumber,
      createUserDto.documentType,
      'password123',
    );
  }
}
