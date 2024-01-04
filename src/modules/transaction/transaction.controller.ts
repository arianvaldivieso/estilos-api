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

@Controller('transaction')
export class TransactionController {
  constructor(private readonly _transactionService: TransactionService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(StandardResponseInterceptor)
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto, @Request() req) {
    return this._transactionService.create(createTransactionDto, req.user);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(StandardResponseInterceptor)
  @Get()
  findAll(@Request() req) {
    return this._transactionService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this._transactionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this._transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._transactionService.remove(+id);
  }
}
