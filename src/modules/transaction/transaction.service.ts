import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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

    const transactionData =
      await this._transactionsRepository.save(payloadTransaction);

    const transaction = new Transaction();
    Object.assign(transaction, transactionData);
    transaction.setTransactionType(user.id);
    return transaction;
  }

  async findAll(user: User) {
    user = await this._usersService.findOneById(user.id, true);
    const transactionsData = await lastValueFrom(
      from(
        this._transactionsRepository.find({
          relations: ['sender', 'receiver'],
        }),
      ),
    );

    const transactions: Transaction[] = transactionsData.map((data) => {
      const transaction = new Transaction();
      Object.assign(transaction, data);
      transaction.setTransactionType(user.id);
      return transaction;
    });

    return transactions;
  }

  async findOne(id: number) {
    return await lastValueFrom(
      from(
        this._transactionsRepository.findOne({
          where: {
            id: id,
          },
        }),
      ),
    );
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

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
