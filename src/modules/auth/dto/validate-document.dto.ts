import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateDocumentDto {
  @IsNotEmpty()
  @IsString()
  documentNumber: string;

  @IsNotEmpty()
  @IsString()
  documentType: string;
}
