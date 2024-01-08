import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { CardService } from '../services/card.service';
import { AssociateCardDto } from '../dto/card.dto';
import { UpdateCardDto } from '../dto/update-card.dto';
import { User } from 'core/auth/user.decorator';
import { Card } from '../entities/card.entity';
import { CardType } from 'core/enums/card-type.enum';
import { RechargeCardDto } from '../dto/recharge.dto';

@Controller('cards')
//@UseGuards(AuthGuard)
//@UseInterceptors(StandardResponseInterceptor)

export class CardController {
  private readonly logger: Logger = new Logger(CardController.name);

  constructor(private readonly _cardService: CardService) {}

  @Post()
  async associate(@Body() associateCardDto: AssociateCardDto, @User() user): Promise<Card> {
    return await this._cardService.associate(associateCardDto, user);
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

  @Get('getBalanceCardStyle/:id')
  async validateBalanceCardStyle(@Param('id') id: string) {
    return await this._cardService.validateBalanceCardStyle(id);
  }

  @Post('list-movement')
  async listMovements(@Body() listMovementCardDto: AssociateCardDto, @User() user) {
    return await this._cardService.listMovements(listMovementCardDto, user);
  }

  @Post('pending-payments')
  async pendingPayments(@Body() pendingPayments: AssociateCardDto, @User() user) {
    return await this._cardService.pendingPayments(pendingPayments, user);
  }

  @Post('recharge')
  async recharge(@Body() rechargeCardDto: RechargeCardDto, @User() user) {
    return await this._cardService.recharge(rechargeCardDto, user);
  }
}
