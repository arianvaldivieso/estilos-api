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

/**
 * Service for managing transactions.
 */
@Injectable()
export class TransactionService {
  /**
   * Constructor of the TransactionService.
   * @param {Repository<Transaction>} _transactionsRepository - Repository for the Transaction entity.
   * @param {UsersService} _usersService - Service for managing users.
   */
  constructor(
    @InjectRepository(Transaction)
    private _transactionsRepository: Repository<Transaction>,
    private readonly _usersService: UsersService,
  ) {}

  /**
   * Current user associated with the service.
   * @type {User}
   * @private
   */
  private currentUser: User;

  /**
   * Gets the current user.
   * @returns {User} - Current user.
   */
  getCurrentUser(): User {
    return this.currentUser;
  }

  /**
   * Creates a new transaction.
   * @param {CreateTransactionDto} createTransactionDto - DTO containing transaction creation data.
   * @param {User} user - User initiating the transaction.
   * @returns {Promise<Transaction>} - Promise resolved with the created transaction.
   * @throws {BadRequestException} - Thrown if there is insufficient balance or the receiver is not found.
   */
  async create(
    createTransactionDto: CreateTransactionDto,
    user: User,
  ): Promise<Transaction> {
    this.currentUser = user;
    const receiverId = createTransactionDto.receiverId;
    const receiver = await this._usersService.findOneById(receiverId);
    const sender = this.currentUser;
    const amount = createTransactionDto.amount;
    const balance = await this.calculateBalance(sender.id);
    if (balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }
    if (!receiver) {
      throw new BadRequestException('User not found');
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

  /**
   * Finds all transactions associated with the current user.
   * @param {User} user - User for whom transactions are fetched.
   * @returns {Promise<Transaction[]>} - Promise resolved with an array of transactions.
   */
  async findAll(user: User): Promise<Transaction[]> {
    this.currentUser = user;
    const transactionsData = await lastValueFrom(
      from(
        this._transactionsRepository.find({
          where: [{ senderId: user.id }, { receiverId: user.id }],
        }),
      ),
    );

    const transactions: Transaction[] = transactionsData.map((data) => {
      return this.computedTransaction(data);
    });

    return transactions;
  }

  /**
   * Finds a specific transaction by ID.
   * @param {number} id - ID of the transaction to be found.
   * @param {User} user - User for whom the transaction is fetched.
   * @returns {Promise<Transaction>} - Promise resolved with the found transaction.
   */
  async findOne(id: number, user: User): Promise<Transaction> {
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

  /**
   * Computed transaction details based on user-specific logic.
   * @param {Transaction} data - Transaction data to be computed.
   * @returns {Transaction} - Computed transaction.
   */
  computedTransaction(data: Transaction): Transaction {
    const transaction = new Transaction();
    Object.assign(transaction, data);
    transaction.setTransactionType(this.currentUser.id);
    return transaction;
  }

  /**
   * Calculates the balance for a user.
   * @param {number} userId - ID of the user for whom the balance is calculated.
   * @returns {Promise<number>} - Promise resolved with the calculated balance.
   */
  async calculateBalance(userId: number): Promise<number> {
    const user = await this._usersService.findOneById(userId, true);
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
