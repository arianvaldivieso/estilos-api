import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StandardResponseInterceptor } from 'core/responses/standard-response.interceptor';
import { AuthGuard } from 'modules/auth/auth.guard';
import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';

/**
 * Controller for managing user-related operations.
 */
@Controller('users')
export class UsersController {
  /**
   * Constructor of the UsersController.
   * @param {UsersService} _usersService - Service for managing users.
   */
  constructor(private readonly _usersService: UsersService) {}

  /**
   * Retrieves the profile of the authenticated user.
   * @param {Request} req - The Express Request object containing user information.
   * @returns {Promise<User>} - Promise resolved with the user profile.
   */
  @UseGuards(AuthGuard)
  @UseInterceptors(StandardResponseInterceptor)
  @Get('profile')
  async getProfile(@Request() req) {
    // Fetch user details along with related roles
    let user: User = await this._usersService.findOneById(req.id, true, [
      'rol',
    ]);

    const simplifiedUserObject = {
      ...user,
      role: user.rol.name,
    };

    return simplifiedUserObject;
  }

  /**
   * Retrieves all users.
   * @returns {Promise<User[]>} - Promise resolved with an array of all users.
   */
  @Get()
  findAll(): Promise<User[]> {
    return this._usersService.findAll();
  }

  /**
   * Retrieves a specific user by ID.
   * @param {string} id - ID of the user to retrieve.
   * @returns {Object} - Object containing a message with the user's ID.
   */
  @Get(':id')
  findOne(@Param('id') id: string): Object {
    return { message: `User ID: ${id}` };
  }
}
