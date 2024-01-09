import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { AuthGuard } from 'modules/auth/auth.guard';
import { StandardResponseInterceptor } from 'core/responses/standard-response.interceptor';
import { User } from 'modules/users/entities/user.entity';
import { UserDecorator } from 'core/auth/user.decorator';
import { ContactService } from './contact.service';
import { Contact } from './entities/contact.entity';
import { CustomContact } from './interface/contact.interface';

/**
 * Controller for managing contact-related operations.
 */
@Controller('contact')
@UseGuards(AuthGuard) // Apply the AuthGuard to protect routes
@UseInterceptors(StandardResponseInterceptor) // Use a standard response interceptor
export class ContactController {
  /**
   * Constructor of the ContactController.
   * @param {ContactService} contactService - Service for managing contacts.
   */
  constructor(private readonly contactService: ContactService) {}

  /**
   * Retrieves all contacts for the authenticated user.
   * @param {User} user - The authenticated user obtained from the request.
   * @returns {Promise<Contact[]>} - Promise resolved with an array of contacts.
   */
  @Get()
  findAll(@UserDecorator() user: User): Promise<CustomContact[]> {
    return this.contactService.findAll(user.id);
  }

  /**
   * Creates a new contact for the authenticated user.
   * @param {CreateContactDto} createContactDto - DTO containing data for creating a contact.
   * @param {User} user - The authenticated user obtained from the request.
   * @returns {Promise<Contact>} - Promise resolved with the created contact.
   */
  @Post()
  create(
    @Body() createContactDto: CreateContactDto,
    @UserDecorator() user: User,
  ): Promise<Contact> {
    return this.contactService.create(createContactDto, user);
  }
}
