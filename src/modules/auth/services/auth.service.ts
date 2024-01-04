import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  //repositories
  userRepository: any;
  loginHistoryRepository: any;

  private readonly logger: Logger = new Logger('AccountController');

  constructor() {}
}
