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
import { OtpService } from './otp.service';

/**
 * Service for managing user-related operations.
 */
@Injectable()
export class UsersService {
  /**
   * Constructor of the UsersService.
   * @param {Repository<User>} usersRepository - Repository for the User entity.
   * @param {RolesService} roleService - Service for managing roles.
   * @param {OtpService} otpService - Service for managing OTPs (One-Time Passwords).
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private roleService: RolesService,
    private otpService: OtpService,
  ) {}

  /**
   * Validates the uniqueness of the email, document number, and phone number.
   * @param {string} email - Email address to check.
   * @param {string} documentNumber - Document number to check.
   * @param {string} cellPhone - Phone number to check.
   * @throws {BadRequestException} - Thrown if any of the fields are already registered.
   */
  async validateUniqueField(
    email: string,
    documentNumber: string,
    cellPhone: string,
  ): Promise<void> {
    const emailExists = await this.findOneByEmail(email);

    if (emailExists) {
      throw new BadRequestException('The email address is already registered.');
    }

    const documentExist = await this.findOneByDocument(documentNumber);

    if (documentExist) {
      throw new BadRequestException('The document is already registered.');
    }

    const phoneExist = await this.findOneByPhone(cellPhone);

    if (phoneExist) {
      throw new BadRequestException('The phone number is already registered.');
    }
  }

  /**
   * Creates a new user.
   * @param {CreateUserDto} createUserDto - DTO containing user creation data.
   * @returns {Promise<User>} - Promise resolved with the created user.
   * @throws {BadRequestException} - Thrown if the email, document, or phone number are not unique.
   */
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

    this.otpService.sendOtp(user, createUserDto.cellPhone, createUserDto.email);

    return user;
  }

  /**
   * Validates user information for uniqueness.
   * @param {ValidateDto} validateDto - DTO containing user validation data.
   * @returns {Promise<boolean>} - Promise resolved with a boolean indicating successful validation.
   * @throws {BadRequestException} - Thrown if the email, document, or phone number are not unique.
   */
  async validateUser(validateDto: ValidateDto): Promise<boolean> {
    await this.validateUniqueField(
      validateDto.email,
      validateDto.documentNumber,
      validateDto.cellPhone,
    );

    return true;
  }

  /**
   * Finds a user by ID.
   * @param {number} id - ID of the user.
   * @param {boolean} includeRelations - Flag to include related entities (sentTransactions, receivedTransactions).
   * @returns {Promise<User>} - Promise resolved with the found user.
   */
  public async findOneById(
    id: number,
    includeRelations: boolean = false,
  ): Promise<User> {
    const options: FindOneOptions<User> = { where: { id: id } };

    if (includeRelations) {
      options.relations = ['sentTransactions', 'receivedTransactions'];
    }

    return await lastValueFrom(from(this.usersRepository.findOne(options)));
  }

  /**
   * Finds a user by email.
   * @param {string} email - Email address to search for.
   * @returns {Promise<User>} - Promise resolved with the found user.
   */
  public async findOneByEmail(email: string): Promise<User> {
    return await lastValueFrom(
      from(this.usersRepository.findOne({ where: { email: email } })),
    );
  }

  /**
   * Finds a user by document number.
   * @param {string} documentNumber - Document number to search for.
   * @returns {Promise<User>} - Promise resolved with the found user.
   */
  public async findOneByDocument(documentNumber: string): Promise<User> {
    return await lastValueFrom(
      from(
        this.usersRepository.findOne({
          where: { documentNumber: documentNumber },
        }),
      ),
    );
  }

  /**
   * Finds a user by phone number.
   * @param {string} cellPhone - Phone number to search for.
   * @returns {Promise<User>} - Promise resolved with the found user.
   */
  public async findOneByPhone(cellPhone: string): Promise<User> {
    return await lastValueFrom(
      from(
        this.usersRepository.findOne({
          where: { cellPhone: cellPhone },
        }),
      ),
    );
  }

  /**
   * Finds all users.
   * @returns {Promise<User[]>} - Promise resolved with an array of all users.
   */
  async findAll(): Promise<User[]> {
    const users = await lastValueFrom(from(this.usersRepository.find()));
    return users;
  }
}
