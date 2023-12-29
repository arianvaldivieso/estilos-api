import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private _usersService: UsersService) {}

  async validate(email: any) {
    console.log(email);
    const user = await this._usersService.findOneByEmail(email);
    if (user) return false;
    return true;
  }

  defaultMessage() {
    return 'Email already exists';
  }
}
