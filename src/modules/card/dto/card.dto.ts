import { CardType } from "core/enums/card-type.enum";
import { IsNumber, IsNotEmpty, IsString, IsEnum, IsOptional } from "class-validator";

export class CardDto {
  @IsNumber()
  @IsNotEmpty()
  receiverId: number;

  @IsString()
  @IsNotEmpty()
  card_number: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(CardType)
  type: CardType;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  number_account: string;
}
