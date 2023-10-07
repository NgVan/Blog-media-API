/* eslint-disable prettier/prettier */
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalGuard extends AuthGuard(['optional-jwt']) {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // if (err || !user) {
    //   throw err || new UnauthorizedException();
    // }
    console.log('Token in option token: ', user);
    return user;
  }
}
