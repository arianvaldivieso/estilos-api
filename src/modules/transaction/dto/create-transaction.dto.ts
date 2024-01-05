import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  receiverId: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
