import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateDto {
  @IsNotEmpty()
  @IsString()
  documentNumber: string;

  @IsNotEmpty()
  @IsString()
  cellPhone: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
