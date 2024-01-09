import { CardType } from "core/enums/card-type.enum";
import { IsNotEmpty, IsString, IsEnum, IsNumber } from "class-validator";

export class ListMovementCardDto {
  @IsNumber()
  @IsNotEmpty()
  receiverId: number;
  
  @IsString()
  @IsNotEmpty()
  cardId: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(CardType)
  type: CardType;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  endDate: string;
}