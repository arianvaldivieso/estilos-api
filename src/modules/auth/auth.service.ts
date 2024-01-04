import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'modules/users/services/users.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private _usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  //TODO: modifica rpara que admita bien el servicio ya que el login
  async signIn(documentNumber, documentType, pass) {
    const user = await this._usersService.findOneByDocument(documentNumber);

    const isPasswordEqual: boolean = await bcrypt.compare(pass, user.password);

    if (!isPasswordEqual) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, documentNumber: user.documentNumber };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
