import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../../auth/dto/create-user.dto';
import { StandardResponseInterceptor } from '@core/responses/standard-response.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'modules/auth/auth.guard';

@Controller('users')
@ApiTags(UsersController.name)
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(StandardResponseInterceptor)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get()
  findAll() {
    return this._usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { message: id };
    //return this._usersService.findOne(+id);
  }
}
