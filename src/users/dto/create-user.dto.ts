import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AllowedRoleType } from 'src/@core/enums/role-type.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail({})
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(AllowedRoleType)
  role: AllowedRoleType;
}
