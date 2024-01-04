import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsArray } from 'class-validator';

export class RegisterStudentDto {
  @ApiProperty({ type: String })
  @IsString()
  readonly firstName: string;

  @ApiProperty({ type: String })
  @IsString()
  readonly lastName: string;

  @ApiProperty({ type: String })
  @IsString()
  readonly username: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  readonly phone: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  readonly address: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  readonly dateOfBirth: string;

  @ApiProperty({ type: String })
  @IsEmail()
  @IsString()
  readonly email: string;

  @ApiProperty({ type: String })
  @IsString()
  password: string;

  @ApiProperty({ type: String })
  @IsString()
  departamentId: string;

  @ApiProperty({ type: String })
  @IsString()
  rolId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  quoteIds: String[];

  @ApiProperty({ type: String })
  @IsString()
  typeDocumentId: string;
}

