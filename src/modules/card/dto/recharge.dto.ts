import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class RechargeCardDto {
  @IsNumber()
  @IsNotEmpty()
  receiverId: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  quotes: number;

  @IsString()
  @IsNotEmpty()
  cardId: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
