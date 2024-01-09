import { PartialType } from '@nestjs/swagger';
import { CardDto } from './card.dto';

export class UpdateCardDto extends PartialType(CardDto) {}
