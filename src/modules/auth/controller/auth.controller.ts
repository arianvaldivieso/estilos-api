import { Body, Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';

@Controller('accounts')
@ApiTags(AuthController.name)
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  constructor(private service: AuthService) {}
}
