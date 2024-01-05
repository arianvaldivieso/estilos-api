import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ResendOtpDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
