import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StandardResponseInterceptor } from 'core/responses/standard-response.interceptor';
import { AuthGuard } from 'modules/auth/auth.guard';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(StandardResponseInterceptor)
  @Get('profile')
  getProfile(@Request() req) {
    return this._usersService.findOneById(req.user.id, true, ['rol']);
  }

  @Get()
  findAll() {
    return this._usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { message: id };
  }
}
