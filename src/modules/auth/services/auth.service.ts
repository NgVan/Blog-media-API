import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import * as moment from 'moment';
import { UserService } from '../../user/services/user.service';
import { SignInDto } from '../dtos/request/signin.dto';
import { ConfigService } from '../../shared/services/config.service';
import { SignUpDto } from '../dtos/request/signup.dto';
import { validatePassword } from 'src/utils/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async signIn(payload: SignInDto): Promise<any> {
    const { emailAddress, password } = payload;
    const { customTokenExpirationDay, authenticationSecret } =
      new ConfigService();

    const user = await this.userRepository.findOneBy({ emailAddress });
    if (!user)
      throw new UnauthorizedException('Email or password is incorrect');
    if (user?.password !== password) {
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

  async signUp(payload: SignUpDto): Promise<any> {
    const { userName, emailAddress, password, passwordConfirm } = payload;
    const { customTokenExpirationDay, authenticationSecret } =
      new ConfigService();

    const foundUser = await this.userRepository.findOneBy({ emailAddress });
    if (foundUser) throw new ConflictException('User has already conflicted');
    if (!validatePassword(password))
      throw new BadRequestException('Invalid Password!');

    if (password !== passwordConfirm)
      throw new BadRequestException('Confirm password not match with password');

    let user: any;
    try {
      // Create user in DB
      user = await this.userRepository.save({
        firstName: userName,
        lastName: userName,
        emailAddress,
        password,
      });
    } catch (error) {
      throw new BadRequestException(error);
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
      data: {
        access_token,
      },
      message: 'Sign up user account successful',
    };
  }
}
