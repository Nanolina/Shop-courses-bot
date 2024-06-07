import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parse, validate } from '@tma.js/init-data-node';
import { MyLogger } from '../logger/my-logger.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private readonly logger: MyLogger,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    try {
      const token = this.configService.get<string>('BOT_TOKEN');
      if (!token) {
        throw new Error('bot token is not defined');
      }

      validate(authorization, token);
      const initData = parse(authorization);
      const { user } = initData;

      if (!user) {
        throw new UnauthorizedException('No user specified');
      }

      // Attach user to request for further use in controllers
      request.user = user;
    } catch (error) {
      const errorMessage = error?.message;
      if (errorMessage === 'Init data expired') {
        throw new UnauthorizedException(
          'Init data expired, please re-authenticate',
        );
      }

      this.logger.error({
        method: 'canActivate',
        error: error?.message || error,
      });

      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
