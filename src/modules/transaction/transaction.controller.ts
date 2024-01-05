import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from 'modules/auth/auth.guard';
import { StandardResponseInterceptor } from '@core/responses/standard-response.interceptor';
import { User } from '@core/auth/user.decorator';

@Controller('transaction')
@UseGuards(AuthGuard)
@UseInterceptors(StandardResponseInterceptor)
export class TransactionController {
  constructor(private readonly _transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto, @User() user) {
    return this._transactionService.create(createTransactionDto, user);
  }

  @Get()
  findAll(@User() user: any) {
    return this._transactionService.findAll(user);
  }

  @Get('balance')
  getBalance(@User() user) {
    return this._transactionService.calculateBalance(user.id);
  }
  @Get(':id')
  findOne(@Param('id') id: string, @User() user) {
    return this._transactionService.findOne(+id, user);
  }
}
