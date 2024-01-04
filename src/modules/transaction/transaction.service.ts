import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { UsersService } from 'modules/users/services/users.service';
import { User } from 'modules/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private _transactionsRepository: Repository<Transaction>,
    private readonly _usersService: UsersService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, user: User) {
    const receiverId = createTransactionDto.receiverId;

    const receiver = await this._usersService.findOneById(receiverId);
    const sender = user;
    const amount = createTransactionDto.amount;
    const balance = await this.calculateBalance(sender.id);

    if (balance < amount) {
      throw new BadRequestException('Saldo insuficiente');
    }
    if (!receiver) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const payloadTransaction = {
      senderId: sender.id,
      receiverId: receiver.id,
      amount: amount,
      status: 'complete',
    };

    return await this._transactionsRepository.save(payloadTransaction);
  }

  async calculateBalance(userId: number): Promise<number> {
    const user = await this._usersService.findOneById(userId, true);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const sentAmount = user.sentTransactions
      .filter((transaction) => transaction.status === 'complete')
      .reduce((total, transaction) => total + transaction.amount, 0);

    const receivedAmount = user.receivedTransactions
      .filter((transaction) => transaction.status === 'complete')
      .reduce((total, transaction) => total + transaction.amount, 0);

    const balance = receivedAmount - sentAmount;

    return balance;
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
