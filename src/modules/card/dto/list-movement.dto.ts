import { CardType } from "core/enums/card-type.enum";
import { IsNotEmpty, IsString } from "class-validator";

export class ListMovementCardDto {
  @IsString()
  @IsNotEmpty()
  card_number: string;

  @IsString()
  @IsNotEmpty()
  type: CardType;

  @IsString()
  @IsNotEmpty()
  password: string;
}
