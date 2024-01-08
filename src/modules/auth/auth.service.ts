import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { UsersService } from 'modules/users/services/users.service';

/**
 * Service for handling authentication-related tasks.
 */
@Injectable()
export class AuthService {
  /**
   * Constructor of the AuthService.
   * @param {UsersService} _usersService - Service for managing users.
   * @param {JwtService} jwtService - Service for handling JWT.
   */
  constructor(
    private _usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Signs in a user with the provided credentials.
   * @param {string} documentNumber - Document number of the user.
   * @param {string} documentType - Document type of the user.
   * @param {string} pass - Password of the user.
   * @returns {Promise<{ access_token: string }>} - Promise resolved with an object containing the access token.
   * @throws {UnauthorizedException} - Thrown if the provided credentials are invalid.
   */
  async signIn(
    documentNumber: string,
    documentType: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this._usersService.findOneByDocument(documentNumber);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordEqual: boolean = await bcrypt.compare(pass, user.password);

    if (!isPasswordEqual) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, documentNumber: user.documentNumber };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateDocument(documentNumber: string, documentType: string) {
    const user = await this._usersService.findOneByDocument(documentNumber);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return 'ok';
  }
}
