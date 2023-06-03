import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import * as moment from 'moment';
import { UserService } from '../../user/services/user.service';
import { SignInDto } from '../dtos/request/signin.dto';
import { ConfigService } from '../../shared/services/config.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async signIn(payload: SignInDto): Promise<any> {
    const { customTokenExpirationDay, authenticationSecret } =
      new ConfigService();

    const user = await this.usersService.findUser(payload.emailAddress);
    if (!user)
      throw new UnauthorizedException('Email or password is incorrect');
    if (user?.password !== payload.password) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
    const expiredDate = moment()
      .add(customTokenExpirationDay, 'd')
      .utc()
      .format();
    const access_token = sign(
      {
        sub: user.id,
        email: user.emailAddress,
        iat: Math.round(new Date().getTime() / 1000),
        exp: Math.round(moment(expiredDate).valueOf() / 1000),
      },
      authenticationSecret,
    );
    return {
      access_token,
    };
  }
}
