import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseGuards, UseInterceptors } from '@nestjs/common';
import { CardService } from '../services/card.service';
import { User } from 'core/auth/user.decorator';
import { Card } from '../entities/card.entity';
import { RechargeCardDto } from '../dto/recharge.dto';
import { CardDto } from '../dto/card.dto';

@Controller('cards')
//@UseGuards(AuthGuard)
//@UseInterceptors(StandardResponseInterceptor)

export class CardController {
  private readonly logger: Logger = new Logger(CardController.name);

  constructor(private readonly _cardService: CardService) {}

  @Post()
  async associate(@Body() associateCardDto: CardDto, @User() user): Promise<Card> {
    return await this._cardService.associate(associateCardDto, user);
  }

  @Get()
  async findAll(@User() user: any) {
    return await this._cardService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User() user) {
    return await this._cardService.findOne(id, user);
  }

  //other functions
  @Get('by-card-number/:cardNumber')
  async getCardByCardNumber(@Param('cardNumber') cardNumber: string) {
    return await this._cardService.getCardByCardNumber(cardNumber);
  }

  @Post('pending-payments')
  async pendingPayments(@Body() pendingPaymentsCardDto: CardDto, @User() user) {
    return await this._cardService.pendingPayments(pendingPaymentsCardDto, user);
  }

  @Post('recharge')
  async recharge(@Body() rechargeCardDto: RechargeCardDto, @User() user) {
    return await this._cardService.recharge(rechargeCardDto, user);
  }
}
