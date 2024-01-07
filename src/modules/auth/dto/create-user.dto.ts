import { AllowedDocumentTypes } from 'core/enums/document-type.enum';
import { AllowedRoleTypes } from 'core/enums/role-type.enum';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName: string | null;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  secondLastName: string;

  @IsNotEmpty()
  @IsString()
  birthdate: Date;

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
