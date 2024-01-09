import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { CustomContact } from '../interface/contact.interface';

export class ContactRepository extends Repository<Contact> {
  constructor(
    @InjectRepository(Contact)
    private userRepository: Repository<Contact>,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  async getMyContacts(userId: number): Promise<CustomContact[]> {
    try {
      const customContacts: CustomContact[] = await this.createQueryBuilder(
        'contact',
      )
        .select([
          'contact.id',
          'contact.contact as user',
          'contact.createdAt as created_at',
          'contact.updateAt as updated_at',
          'isFavorite as is_favorite',
        ])
        .where('contact.ownerId = :userId', { userId })
        .getRawMany();

      return customContacts;
    } catch (error) {
      console.error('Error while fetching contacts:', error);
      throw new Error('Failed to fetch contacts.');
    }
  }
}
