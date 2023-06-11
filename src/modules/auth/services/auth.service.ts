import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import { SignInDto } from '../dtos/request/signin.dto';
import { ConfigService } from '../../shared/services/config.service';
import { SignUpDto } from '../dtos/request/signup.dto';
import { validatePassword } from 'src/utils/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { EmailService } from '../../shared/services/mail.service';
import { ForgotPasswordDto } from '../dtos/request/forgotPassword.dto';
import { AuthEntity } from '../entities/auth.entity';
import { RequestContext } from 'src/utils/request-context';
import { AppRequest } from 'src/utils/app-request';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private emailService: EmailService,
  ) {}

  getTokens(user) {
    const {
      jwtAccessTokenSecret,
      jwtRefreshTokenSecret,
      accessTokenHour,
      refreshTokenDay,
    } = new ConfigService();
    const accessTokenExpiredDate = moment()
      .add(accessTokenHour, 'hours')
      .utc()
      .format();
    const refreshTokenExpiredDate = moment()
      .add(refreshTokenDay, 'd')
      .utc()
      .format();

    const accessToken = sign(
      {
        sub: user?.id,
        email: user?.emailAddress,
        iat: Math.round(new Date().getTime() / 1000),
        exp: Math.round(moment(accessTokenExpiredDate).valueOf() / 1000),
      },
      jwtAccessTokenSecret,
    );
    const refreshToken = sign(
      {
        sub: user?.id,
        email: user?.emailAddress,
        iat: Math.round(new Date().getTime() / 1000),
        exp: Math.round(moment(refreshTokenExpiredDate).valueOf() / 1000),
      },
      jwtRefreshTokenSecret,
    );
    return { accessToken, refreshToken };
  }

  async signIn(payload: SignInDto): Promise<any> {
    const { emailAddress, password } = payload;

    const user = await this.userRepository.findOneBy({ emailAddress });
    if (!user)
      throw new UnauthorizedException('Email or password is incorrect');
    const match = await bcrypt.compare(password, user?.password);
    if (!match)
      throw new UnauthorizedException('Email or password is incorrect');

    const tokens = this.getTokens(user);
    const foundAuth = await this.authRepository.findOneBy({ userId: user.id });
    if (!foundAuth)
      await this.authRepository.save({ ...tokens, userId: user.id });
    else await this.authRepository.save({ ...tokens, id: foundAuth.id });
    return {
      data: tokens,
      message: 'Sign in successfully',
    };
  }

  async signUp(payload: SignUpDto): Promise<any> {
    const { userName, emailAddress, password, passwordConfirm } = payload;

    const foundUser = await this.userRepository.findOneBy({ emailAddress });
    if (foundUser) throw new ConflictException('User has already conflicted');
    if (!validatePassword(password))
      throw new BadRequestException('Invalid Password!');

    if (password !== passwordConfirm)
      throw new BadRequestException('Confirm password not match with password');

    let user: any;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
      // Create user in DB
      user = await this.userRepository.save({
        firstName: userName,
        lastName: userName,
        emailAddress,
        password: hashedPassword,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }

    const tokens = this.getTokens(user);
    await this.authRepository.save({ ...tokens, userId: user.id });

    return {
      data: tokens,
      message: 'Sign up user account successfully',
    };
  }

  async refreshTokens(context: AppRequest): Promise<any> {
    const { user } = context;

    const foundUser = await this.userRepository.findOneBy({ id: user.sub });
    if (!foundUser) throw new ForbiddenException('Access Denied');
    const foundAuth = await this.authRepository.findOneBy({
      refreshToken: user.refreshToken,
    });
    if (!foundAuth) throw new ForbiddenException('Access Denied');

    const tokens = this.getTokens(foundUser);
    await this.authRepository.save({ ...tokens, id: foundAuth.id });
    return {
      data: tokens,
      message: 'Refresh token successfully',
    };
  }

  async forgotPassword(payload: ForgotPasswordDto): Promise<any> {
    const { emailAddress } = payload;
    const { refreshTokenDay } = new ConfigService();
    const foundUser = await this.userRepository.findOneBy({
      emailAddress,
    });
    if (!foundUser)
      throw new NotFoundException('User does not exist in system');

    const tokens = this.getTokens(foundUser);

    const url = `http://localhost:3000/resetPassword/${tokens.refreshToken}`;
    // sendEmail(emailAddress, url, 'Reset your password');

    // return {
    //   success:
    //     'Send email reset your password successful! Please check your email',
    // };
    const emailTilte = 'Reset your password';
    return await this.emailService.sendMail(emailAddress, emailTilte, url);
  }

  async logout(context: AppRequest): Promise<any> {
    const { user } = context;

    const foundAuth = await this.authRepository.findOneBy({
      userId: user.sub,
    });
    if (!foundAuth) throw new ForbiddenException('Access Denied');
    await this.authRepository.delete(foundAuth.id);
    return {
      message: 'Logout successfully',
    };
  }

  async hasAccessToken(accessToken): Promise<any> {
    const foundToken = await this.authRepository.findOneBy({ accessToken });
    return !foundToken ? null : foundToken;
  }
}
