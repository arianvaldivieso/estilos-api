import { AllowedDocumentTypes } from '@core/enums/document-type.enum';
import { AllowedRoleTypes } from '@core/enums/role-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  avatar: string;

  @ApiProperty({ enum: AllowedDocumentTypes })
  @IsNotEmpty()
  @IsEnum(AllowedDocumentTypes)
  documentType: AllowedDocumentTypes;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  documentNumber: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  cellPhone: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ type: Boolean })
  @IsNotEmpty()
  @IsBoolean()
  termsAndConditions: boolean;

  @ApiProperty({ type: Boolean })
  @IsNotEmpty()
  @IsBoolean()
  dataPrivacy: boolean;

  @ApiProperty({ type: Boolean })
  @IsNotEmpty()
  @IsBoolean()
  electronicMoneyContract: boolean;

  @ApiProperty({ type: Boolean })
  @IsNotEmpty()
  @IsBoolean()
  offersAndDiscounts: boolean;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ enum: AllowedRoleTypes })
  @IsNotEmpty()
  @IsEnum(AllowedRoleTypes)
  role: string;
}
