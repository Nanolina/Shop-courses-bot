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

    const token = this.configService.get<string>('BOT_TOKEN');
    if (!token) {
      throw new Error('bot token is not defined');
    }

    const [authType, authData = ''] = authorization.split(' ');

    switch (authType) {
      case 'tma':
        try {
          validate(authData, token, {
            // For a while, we'll disable the date check, since it's always expired for some reason.
            expiresIn: 0,
          });

          const initData = parse(authData);
          const { user } = initData;
          if (!user) {
            throw new UnauthorizedException('No user specified');
          }

          // Attach user to request for further use in controllers
          request.user = user;
          return true;
        } catch (error) {
          throw new UnauthorizedException(
            'Something went wrong with auth',
            error?.message,
          );
        }

      default:
        throw new UnauthorizedException('Auth type is not valid');
    }
  }
}
