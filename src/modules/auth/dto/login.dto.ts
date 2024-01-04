import { AllowedDocumentTypes } from '@core/enums/document-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ enum: AllowedDocumentTypes })
  @IsNotEmpty()
  @IsEnum(AllowedDocumentTypes)
  documentType: AllowedDocumentTypes;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  documentNumber: string;
}
