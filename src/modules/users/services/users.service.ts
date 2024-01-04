import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../auth/dto/create-user.dto';
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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const emailExists = await this.findOneByEmail(createUserDto.email);
    const documentExist = await this.findOneByDocument(
      createUserDto.documentNumber,
    );

    const phoneExist = await this.findOneByPhone(createUserDto.cellPhone);

    if (emailExists) {
      throw new BadRequestException(
        'El correo electrónico ya está registrado.',
      );
    }

    if (documentExist) {
      throw new BadRequestException('El documento ya está registrado.');
    }

    if (phoneExist) {
      throw new BadRequestException('El télefono ya está registrado.');
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

  public async findOneByDocument(documentNumber: string): Promise<User> {
    return await lastValueFrom(
      from(
        this._usersRepository.findOne({
          where: { documentNumber: documentNumber },
        }),
      ),
    );
  }

  public async findOneByPhone(cellPhone: string): Promise<User> {
    return await lastValueFrom(
      from(
        this._usersRepository.findOne({
          where: { cellPhone: cellPhone },
        }),
      ),
    );
  }

  async findAll() {
    const users = await lastValueFrom(from(this._usersRepository.find()));
    return users;
  }
}
