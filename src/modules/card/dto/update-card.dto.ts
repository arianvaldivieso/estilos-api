import { PartialType } from '@nestjs/swagger';
import { AssociateCardDto } from './card.dto';

export class UpdateCardDto extends PartialType(AssociateCardDto) {}
