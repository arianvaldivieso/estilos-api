import { ExecutionContext, Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { UsersModule } from 'modules/users/users.module';
import { GlobalConfig } from 'modules/admin/entities/global-config.entity';
import { ConfigService } from 'modules/admin/services/config/config.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, GlobalConfig]), UsersModule],
  controllers: [TransactionController],
  providers: [TransactionService, ConfigService],
})
export class TransactionModule {}
