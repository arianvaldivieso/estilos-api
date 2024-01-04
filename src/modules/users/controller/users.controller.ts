import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { StandardResponseInterceptor } from '@core/responses/standard-response.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags(UsersController.name)
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Post()
  @UseInterceptors(StandardResponseInterceptor)
  create(@Body() createUserDto: CreateUserDto) {
    const user = this._usersService.create(createUserDto);
    return user;
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
