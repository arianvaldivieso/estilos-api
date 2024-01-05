import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../auth/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { lastValueFrom } from 'rxjs';
import { from } from 'rxjs';
import { log } from 'console';
import { RolesService } from 'modules/roles/services/roles.service';
import { Role } from 'modules/roles/entities/role.entity';
import { ValidateDto } from 'modules/auth/dto/validate.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private _usersRepository: Repository<User>,
    private _roleService: RolesService,
  ) {}

  async validateUniqueField(email, documentNumber, cellPhone) {
    const emailExists = await this.findOneByEmail(email);

    if (emailExists) {
      throw new BadRequestException(
        'El correo electrónico ya está registrado.',
      );
    }

    const documentExist = await this.findOneByDocument(documentNumber);

    if (documentExist) {
      throw new BadRequestException('El documento ya está registrado.');
    }

    const phoneExist = await this.findOneByPhone(cellPhone);

    if (phoneExist) {
      throw new BadRequestException('El télefono ya está registrado.');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.validateUniqueField(
      createUserDto.email,
      createUserDto.documentNumber,
      createUserDto.cellPhone,
    );

    const newUser = Object.assign(new User(), createUserDto);
    const roleName = createUserDto.role;

    const role: Role = await this._roleService.findOneByName(roleName);
    newUser.rol = role;
    return await this._usersRepository.save(newUser);
  }

  async validateUser(validateDto: ValidateDto) {
    await this.validateUniqueField(
      validateDto.email,
      validateDto.documentNumber,
      validateDto.cellPhone,
    );

    return true;
  }

  public async findOneById(id: number, includeRelations: boolean = false) {
    const options: FindOneOptions<User> = { where: { id: id } };

    if (includeRelations) {
      options.relations = ['sentTransactions', 'receivedTransactions'];
    }

    return await lastValueFrom(from(this._usersRepository.findOne(options)));
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
