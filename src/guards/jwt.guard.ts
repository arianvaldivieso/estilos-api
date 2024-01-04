// External dependencies
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Logger,
    Inject,
} from '@nestjs/common';
import { TokenDto } from 'modules/auth/dto/token.dto';
import { AuthService } from 'modules/auth/services/auth.service';
import { UtilService } from 'modules/util/services/util.service';

// Internal dependencies

@Injectable()
export class JwtGuard implements CanActivate {
    private readonly logger: Logger = new Logger(JwtGuard.name);
    constructor(
        private readonly utilService: UtilService,
        private readonly authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<any> {
        this.logger.log('CAN_ACTIVE::INIT');
        let response;
        try {
            const request = context.switchToHttp().getRequest();
            const token: TokenDto = {
                bearerToken: request.headers['authorization'],
                isError: false,
            };
            if (!token) {
                throw new UnauthorizedException();
            }
            response = await this.authService.validateUserToken(token);
            if (!response || (response && response.isError)) {
                throw new Error();
            }
            request.userId = response.userId;
            this.logger.log('CAN_ACTIVE::FINISH');
            return request.IsEmail ? false : true;
        } catch (error) {
            throw this.utilService.buildErrorResponseGuard(response);
        }
    }
}
