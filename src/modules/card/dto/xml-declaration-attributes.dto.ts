import { IsNotEmpty, IsString, IsBoolean, IsOptional } from "class-validator";

export class XmlDeclarationAttributesDto {
  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  @IsOptional()
  encoding: string;

  @IsBoolean()
  @IsOptional()
  standalone: boolean;
}
