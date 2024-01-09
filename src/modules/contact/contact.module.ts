import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { UsersModule } from 'modules/users/users.module';
import { ContactService } from './contact.service';
import { ContactRepository } from './repositories/contact.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Contact]), UsersModule],
  controllers: [ContactController],
  providers: [ContactService, ContactRepository],
})
export class ContactModule {}
