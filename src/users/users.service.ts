import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { lastValueFrom } from 'rxjs';
import { from } from 'rxjs';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private _usersRepository: Repository<User>,
    private _roleService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = Object.assign(new User(), createUserDto);
      const roleName = createUserDto.role;

      newUser.role = await this._roleService.findOneByName(roleName);
      return await this._usersRepository.save(newUser);
    } catch (error) {
      Logger.error(error.message);

      throw new InternalServerErrorException(
        'Ocurrió un error interno al crear el usuario.',
      );
    }
  }

  public async findOneByEmail(email: string): Promise<User> {
    Logger.log(email);
    try {
      return await lastValueFrom(
        from(this._usersRepository.findOne({ where: { email: email } })),
      );
    } catch (error) {
      Logger.error(error.message);

      throw new InternalServerErrorException(
        'Ocurrió un error interno al buscar el usuario.',
      );
    }
  }

  async findAll() {
    const users = await lastValueFrom(from(this._usersRepository.find()));
    return users;
  }

  /* update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  } */
}
