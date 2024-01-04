import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { lastValueFrom } from 'rxjs';
import { from } from 'rxjs';
import { log } from 'console';
import { RolesService } from 'modules/roles/services/roles.service';
import { Role } from 'modules/roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private _usersRepository: Repository<User>,
    private _roleService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const emailExists = await this.findOneByEmail(createUserDto.email);

    if (emailExists) {
      throw new BadRequestException(
        'El correo electrónico ya está registrado.',
      );
    }

    const newUser = Object.assign(new User(), createUserDto);
    const roleName = createUserDto.role;

    const role: Role = await this._roleService.findOneByName(roleName);
    newUser.rol = role;
    return await this._usersRepository.save(newUser);
  }

  public async findOneByEmail(email: string): Promise<User> {
    return await lastValueFrom(
      from(this._usersRepository.findOne({ where: { email: email } })),
    );
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
