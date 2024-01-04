import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { UsersService } from 'modules/users/services/users.service';
import { User } from 'modules/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { from, lastValueFrom } from 'rxjs';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private _transactionsRepository: Repository<Transaction>,
    private readonly _usersService: UsersService,
  ) {}

  private currentUser: User;

  getCurrentUser(): User {
    return this.currentUser;
  }

  async create(createTransactionDto: CreateTransactionDto, user) {
    this.currentUser = user;
    const receiverId = createTransactionDto.receiverId;
    const receiver = await this._usersService.findOneById(receiverId);
    const sender = this.currentUser;
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
    const transactionData =
      await this._transactionsRepository.save(payloadTransaction);

    return this.computedTransaction(transactionData);
  }

  async findAll(user: User) {
    this.currentUser = user;
    const transactionsData = await lastValueFrom(
      from(
        this._transactionsRepository.find({
          //relations: ['sender', 'receiver'],
          where: [{ senderId: 3 }, { receiverId: 3 }],
        }),
      ),
    );

    const transactions: Transaction[] = transactionsData.map((data) => {
      return this.computedTransaction(data);
    });

    return transactions;
  }

  async findOne(id: number, user: User) {
    this.currentUser = user;
    return this.computedTransaction(
      await lastValueFrom(
        from(
          this._transactionsRepository.findOne({
            where: {
              id: id,
            },
          }),
        ),
      ),
    );
  }

  computedTransaction(data: Transaction) {
    const transaction = new Transaction();
    Object.assign(transaction, data);
    transaction.setTransactionType(this.currentUser.id);
    return transaction;
  }

  async calculateBalance(userId: number): Promise<number> {
    const user = await this._usersService.findOneById(userId, true);
    console.log('holas');
    const sentAmount = user.sentTransactions
      .filter((transaction) => transaction.status === 'complete')
      .reduce((total, transaction) => total + transaction.amount, 0);

    const receivedAmount = user.receivedTransactions
      .filter((transaction) => transaction.status === 'complete')
      .reduce((total, transaction) => total + transaction.amount, 0);

    const balance = receivedAmount - sentAmount;

    return balance;
  }
}
