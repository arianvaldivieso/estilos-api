import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './entities/contact.entity';
import { DeepPartial } from 'typeorm';
import { User } from 'modules/users/entities/user.entity';
import { concat, from, lastValueFrom } from 'rxjs';
import { UsersService } from 'modules/users/services/users.service';
import { CustomContact } from './interface/contact.interface';
import { ContactRepository } from './repositories/contact.repository';
import { RemoveContactDto } from './dto/remove-contact.dto';

/**
 * Service for managing operations related to contacts.
 */
@Injectable()
export class ContactService {
  /**
   * Constructor of the ContactService.
   * @param {Repository<Contact>} contactRepository - Repository for the Contact entity.
   * @param {UsersService} userService - Service for managing users.
   */
  constructor(
    private contactRepository: ContactRepository,
    private readonly userService: UsersService,
  ) {}

  /**
   * Creates a new contact for the specified user.
   * @param {CreateContactDto} createContactDto - DTO containing data for creating a contact.
   * @param {User} user - The user for whom the contact is created.
   * @returns {Promise<Contact>} - Promise resolved with the created contact.
   * @throws {BadRequestException} - Thrown if the specified user or contact is not found, or if the contact already exists.
   */
  async create(
    createContactDto: CreateContactDto,
    user: User,
  ): Promise<Contact> {
    try {
      // Find the contact based on the provided phone number
      const contact = await lastValueFrom(
        from(this.userService.findOneByPhone(createContactDto.cellPhone)),
      );

      // Check if the contact exists
      if (!contact) {
        throw new BadRequestException('User Not Found');
      }

      // Check if the contact already exists for the specified user
      const existingContact = await this.contactRepository.findOne({
        where: {
          owner: { id: user.id },
          contact: { id: contact.id },
        },
        relations: ['owner', 'contact'],
      });

      // If the contact already exists, return it
      if (existingContact) {
        return existingContact;
      }

      // If the contact doesn't exist, create a new contact
      const newContact: DeepPartial<Contact> = {
        owner: { id: user.id },
        contact: { id: contact.id },
      };

      return lastValueFrom(from(this.contactRepository.save(newContact)));
    } catch (error) {
      throw new BadRequestException('Contact creation failed: ' + error);
    }
  }

  /**
   * Finds all contacts for a specific user.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<CustomContact[]>} - Promise resolved with an array of custom contacts.
   */
  async findAll(userId: number): Promise<CustomContact[]> {
    try {
      // Retrieve contacts from the repository based on the provided userId
      const contacts: Contact[] = await lastValueFrom(
        from(
          this.contactRepository.find({
            where: {
              owner: { id: userId },
            },
            relations: ['contact'],
          }),
        ),
      );

      // Map and transform contacts into the desired custom structure
      const customContacts: CustomContact[] = contacts.map(
        (contact: Contact) => ({
          id: contact.id,
          position: 0,
          user: contact.contact,
          created_at: contact.createdAt.toISOString(),
          updated_at: contact.updateAt.toISOString(),
          is_favorite: true,
        }),
      );

      return customContacts;
    } catch (error) {
      // Handle any potential errors during the process
      console.error('Error while fetching contacts:', error);
      throw new Error('Failed to fetch contacts.');
    }
  }

  async remove(
    removeContactDto: RemoveContactDto,
    user: User,
  ): Promise<string> {
    try {
      let existContact = await this.userService.findOneByPhone(
        removeContactDto.cellPhone,
      );

      // Find the contact based on the provided contactId
      const contact = await this.contactRepository.findOne({
        where: {
          owner: { id: user.id },
          contact: { id: existContact.id },
        },
      });

      // Check if the contact exists
      if (!contact) {
        throw new BadRequestException('Contact Not Found');
      }

      // Remove the contact
      await this.contactRepository.remove(contact);
      return 'ok';
    } catch (error) {
      throw new BadRequestException('Contact removal failed: ' + error);
    }
  }
}
