import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';
import { AllowedRoleTypes } from 'src/@core/enums/role-type.enum';
import { IsEmailAlreadyExistConstraint } from 'src/@core/validations/user-email.validation';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail({})
  @Validate(IsEmailAlreadyExistConstraint)
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(AllowedRoleTypes)
  role: string;
}
