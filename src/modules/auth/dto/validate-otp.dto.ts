import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ValidateOtpDto {
  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
