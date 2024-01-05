import { CardType } from "@core/enums/card-type.enum";
import { IsNumber, IsNotEmpty, IsString } from "class-validator";

export class CreateCardDto {
  @IsNumber()
  @IsNotEmpty()
  receiverId: number;

  @IsString()
  @IsNotEmpty()
  card_number: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: CardType;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  number_account: string;
}
