import { Module } from '@nestjs/common';
import { CardService } from './services/card.service';
import { CardController } from './controller/card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'modules/users/users.module';
import { Card } from './entities/card.entity';
import { XmlsService } from './services/xmls.service';
import { TransactionService } from 'modules/transaction/transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card]), 
    UsersModule,
  ],
  controllers: [CardController],
  providers: [CardService, XmlsService],
})
export class CardModule {}
