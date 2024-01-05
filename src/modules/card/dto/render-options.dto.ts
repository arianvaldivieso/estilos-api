import { IsNotEmpty, IsString, IsBoolean, IsOptional } from "class-validator";

export class RenderOptions {
  @IsString()
  @IsNotEmpty()
  newline: string;

  @IsString()
  @IsOptional()
  indent: string;

  @IsBoolean()
  @IsOptional()
  pretty: boolean;
}
