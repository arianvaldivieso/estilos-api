import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../auth/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { lastValueFrom } from 'rxjs';
import { from } from 'rxjs';
import { RolesService } from 'modules/roles/services/roles.service';
import { Role } from 'modules/roles/entities/role.entity';
import { ValidateDto } from 'modules/auth/dto/validate.dto';
import { OtpServiceService } from './otp.service.service';
import { TwilioService } from './twilio.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private roleService: RolesService,
    private otpService: OtpServiceService,
    private twilioService: TwilioService,
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

    const role: Role = await this.roleService.findOneByName(roleName);
    newUser.rol = role;
    const user = await this.usersRepository.save(newUser);

    const otp = await this.otpService.createOtp(user, 5);

    const messageBody = `Tu código de verificación es: ${otp.otp}. No compartas este código con nadie.`;
    this.twilioService.sendSMS(createUserDto.cellPhone, messageBody);

    return user;
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

    return await lastValueFrom(from(this.usersRepository.findOne(options)));
  }

  public async findOneByEmail(email: string): Promise<User> {
    return await lastValueFrom(
      from(this.usersRepository.findOne({ where: { email: email } })),
    );
  }

  public async findOneByDocument(documentNumber: string): Promise<User> {
    return await lastValueFrom(
      from(
        this.usersRepository.findOne({
          where: { documentNumber: documentNumber },
        }),
      ),
    );
  }

  public async findOneByPhone(cellPhone: string): Promise<User> {
    return await lastValueFrom(
      from(
        this.usersRepository.findOne({
          where: { cellPhone: cellPhone },
        }),
      ),
    );
  }

  async findAll() {
    const users = await lastValueFrom(from(this.usersRepository.find()));
    return users;
  }
}
