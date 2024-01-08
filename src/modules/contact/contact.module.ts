import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { UsersModule } from 'modules/users/users.module';
import { ContactService } from './contact.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contact]), UsersModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
