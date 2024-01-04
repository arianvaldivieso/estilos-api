import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { UsersModule } from 'modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), UsersModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
