import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { CardService } from '../services/card.service';
import { CreateCardDto } from '../dto/create-card.dto';
import { UpdateCardDto } from '../dto/update-card.dto';
import { User } from '@core/auth/user.decorator';
import { Card } from '../entities/card.entity';
import { CardType } from '@core/enums/card-type.enum';
import { ListMovementCardDto } from '../dto/list-movement.dto';
import { StandardResponseInterceptor } from '@core/responses/standard-response.interceptor';
import { AuthGuard } from 'modules/auth/auth.guard';

@Controller('card')
@UseGuards(AuthGuard)
@UseInterceptors(StandardResponseInterceptor)

export class CardController {
  private readonly logger: Logger = new Logger(CardController.name);

  constructor(private readonly _cardService: CardService) {}

  @Post()
  async create(@Body() createCardDto: CreateCardDto, @User() user): Promise<Card> {
    return await this._cardService.create(createCardDto, user);
  }

  @Get()
  async findAll(@User() user: any) {
    return await this._cardService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this._cardService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this._cardService.update(id, updateCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._cardService.remove(id);
  }

  //other functions
  @Get('by-card-number/:cardNumber')
  async getCardByCardNumber(@Param('cardNumber') cardNumber: string) {
    return await this._cardService.getCardByCardNumber(cardNumber);
  }

  @Get('by-user')
  async getCardByUserId(@User() user: any) {
    return await this._cardService.getCardByUserId(user);
  }

  @Get('by-type/:type')
  async getCardByType(@Param('type') type: CardType) {
    return await this._cardService.getCardByType(type);
  }

  @Post('list-movement')
  async listMovements(@Body() listMovementCardDto: ListMovementCardDto, @User() user) {
    return await this._cardService.listMovements(listMovementCardDto, user);
  }
}
