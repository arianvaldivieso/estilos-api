import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { AllowedDocumentTypes } from 'src/@core/enums/document-type.enum';
import { AllowedRoleTypes } from 'src/@core/enums/role-type.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  avatar: string;

  @IsNotEmpty()
  @IsEnum(AllowedDocumentTypes)
  documentType: AllowedDocumentTypes;

  @IsNotEmpty()
  @IsString()
  documentNumber: string;

  @IsNotEmpty()
  @IsString()
  cellPhone: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsBoolean()
  termsAndConditions: boolean;

  @IsNotEmpty()
  @IsBoolean()
  dataPrivacy: boolean;

  @IsNotEmpty()
  @IsBoolean()
  electronicMoneyContract: boolean;

  @IsNotEmpty()
  @IsBoolean()
  offersAndDiscounts: boolean;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(AllowedRoleTypes)
  role: string;
}
