/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
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
import { AppRequest } from 'src/utils/app-request';
import { ResetPasswordDto } from '../dtos/request/resetPassword.dto';
import { PermissionTypes, RoleTypes } from 'src/utils/enum';
import { RegisterDto } from '../dtos/request/register.dto';
// import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private emailService: EmailService, // private mailerService: MailerService,
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
        userName: user?.userName,
        role: user?.role,
        permission: user?.permission.split('-'),
        iat: Math.round(new Date().getTime() / 1000),
        exp: Math.round(moment(accessTokenExpiredDate).valueOf() / 1000),
      },
      jwtAccessTokenSecret,
    );
    const refreshToken = sign(
      {
        sub: user?.id,
        email: user?.emailAddress,
        userName: user?.userName,
        iat: Math.round(new Date().getTime() / 1000),
        exp: Math.round(moment(refreshTokenExpiredDate).valueOf() / 1000),
      },
      jwtRefreshTokenSecret,
    );
    return { accessToken, refreshToken };
  }

  async signIn(payload: SignInDto): Promise<any> {
    const { emailOrUserName, password } = payload;
    let user;
    user = await this.userRepository.findOneBy({
      emailAddress: emailOrUserName,
    });

    if (!user) {
      user = await this.userRepository.findOneBy({ userName: emailOrUserName });
      if (!user)
        throw new BadRequestException(
          'Email or userName or password is incorrect',
        );
    }
    if (user.password === null)
      throw new BadRequestException(
        'This account is register via google or facebook. Please login with google or facebook',
      );
    const match = await bcrypt.compare(password, user?.password);
    if (!match) {
      throw new BadRequestException('Email or password is incorrect');
    }

    const tokens = this.getTokens(user);
    const foundAuth = await this.authRepository
      .createQueryBuilder('auth')
      .where('auth.userId = :userId', { userId: user.id })
      .andWhere('auth.refreshToken IS NOT NULL')
      .getOne();
    console.log({ foundAuth });
    if (!foundAuth)
      await this.authRepository.save({
        ...tokens,
        userId: user.id,
      });
    // Tạo mới record
    else {
      const updateAuthToken = await this.authRepository.save({
        ...tokens,
        id: foundAuth.id,
      });
      // Update record
      console.log({ updateAuthToken });
    }

    return {
      data: tokens,
      message: 'Sign in successfully',
    };
  }

  async register(payload: RegisterDto): Promise<any> {
    const { frontendURL } = new ConfigService();
    const { emailAddress } = payload;
    let user;
    user = await this.userRepository.findOneBy({
      emailAddress,
    });
    if (user && user.userName !== null)
      throw new ConflictException(
        'This Account is exist in system, Please login instead of register',
      );
    if (user) {
      // Delete token and refresh-token after register successfully
      await this.authRepository.delete({ userId: user.id });
    } else {
      try {
        // Create user in DB
        user = await this.userRepository.save({
          emailAddress,
          role: RoleTypes.USER,
          permission: PermissionTypes.COMMENT,
          emailVerified: false,
        });
      } catch (error) {
        throw new BadRequestException(error);
      }
    }

    const tokens = this.getTokens(user);
    await this.authRepository.save({ ...tokens, userId: user.id });

    const url = `${frontendURL}/signup/${tokens.accessToken}`;

    const emailTilte = 'Register new account';
    await this.emailService.sendRegisterMail(emailAddress, emailTilte, url);

    // await this.mailerService.sendMail({
    //   to: emailAddress,
    //   subject: 'Register new account',
    //   template: './template',
    //   context: {
    //     url: `${frontendURL}/signup`,
    //     action: 'go to the register of Media Blog',
    //   },
    // });
    return {
      message:
        'Sign up link is sent to your email and it is valid in 2 hours. Please check your email',
    };
  }

  async signUp(context: AppRequest, payload: SignUpDto): Promise<any> {
    const { frontendURL } = new ConfigService();
    const { user } = context;
    console.log({ user });

    const { userName, displayName, password, passwordConfirm } = payload;
    console.log({ payload });

    const foundUser = await this.userRepository.findOneBy({ id: user.id });
    if (!foundUser)
      throw new BadRequestException(
        'User do not exist in system. You need register account before sign up',
      );
    if (!validatePassword(password))
      throw new BadRequestException('Invalid Password!');

    if (password !== passwordConfirm)
      throw new BadRequestException('Confirm password not match with password');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
      // Update user in DB
      await this.userRepository.save({
        id: user.sub,
        userName,
        displayName,
        password: hashedPassword,
        emailVerified: true,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }

    const tokens = this.getTokens(foundUser);

    const foundAuth = await this.authRepository
      .createQueryBuilder('auth')
      .where('auth.userId = :userId', { userId: foundUser.id })
      .andWhere('auth.refreshToken IS NOT NULL')
      .getOne();

    await this.authRepository.save({
      id: foundAuth.id,
      ...tokens,
    });
    // Update record

    // Send mail to inform user that signup is successful
    const url = frontendURL; // URL: should send Dashboard
    const emailTilte = 'Welcom! You are signup successfully';
    await this.emailService.sendSignupMail(
      foundUser.emailAddress,
      emailTilte,
      url,
    );
    // await this.mailerService.sendMail({
    //   to: emailAddress,
    //   subject: 'Welcom! You are signup successfully',
    //   template: './template',
    //   context: {
    //     url: frontendURL,
    //     action: 'go to the Media Blog',
    //   },
    // });
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
    const { frontendURL } = new ConfigService();
    const { emailAddress } = payload;
    const foundUser = await this.userRepository.findOneBy({
      emailAddress,
    });
    if (!foundUser)
      throw new NotFoundException('User does not exist in system');

    const tokens = this.getTokens(foundUser);
    await this.authRepository.save({
      accessToken: tokens.accessToken,
      userId: foundUser.id,
    });
    // url : là trỏ đến đường dẫn của Frontend
    const url = `${frontendURL}/reset-password/${tokens.accessToken}`;

    const emailTilte = 'Reset your password';
    await this.emailService.sendMail(emailAddress, emailTilte, url);

    // await this.mailerService.sendMail({
    //   to: emailAddress,
    //   subject: 'Reset your password',
    //   template: './template',
    //   context: {
    //     url: url,
    //     action: 'reset your account password',
    //   },
    // });
    return {
      message:
        'Forgot password link sent to your email with time duration is 2 hours. Please check your email',
    };
  }

  async resetPassword(
    context: AppRequest,
    payload: ResetPasswordDto,
  ): Promise<any> {
    const { frontendURL } = new ConfigService();
    const { user } = context;
    const { newPassword, confirmNewPassword } = payload;

    const foundUser = await this.userRepository.findOneBy({ id: user.id });
    if (!foundUser) throw new NotFoundException('User not found');

    if (!validatePassword(newPassword))
      throw new BadRequestException('Invalid Password!');
    if (newPassword !== confirmNewPassword)
      throw new BadRequestException('Confirm password not match with password');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    try {
      // Update/reset user password in DB
      await this.userRepository.save({
        id: user.sub,
        emailAddress: user.email,
        password: hashedPassword,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }

    // Delete token and refresh-token after reset password successfully
    await this.authRepository.delete({ userId: user.sub });

    // Send mail to inform user that reset password is successful
    const url = frontendURL; // URL: should send Dashboard
    const emailTilte = 'Welcom! You are reset password successfully';

    await this.emailService.sendSignupMail(user.email, emailTilte, url);

    // await this.mailerService.sendMail({
    //   to: user.email,
    //   subject: emailTilte,
    //   template: './template',
    //   context: {
    //     url: url,
    //     action: 'go to the Media Blog',
    //   },
    // });

    return {
      message: 'Reset password successfully. You need to login again',
    };
  }

  async logout(context: AppRequest): Promise<any> {
    const { user } = context;

    const foundAuth = await this.authRepository
      .createQueryBuilder('auth')
      .where('auth.userId = :userId', { userId: user.sub })
      .andWhere('auth.refreshToken IS NOT NULL')
      .getOne();
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

  async googleLogin(req) {
    const { frontendURL } = new ConfigService();
    if (!req.user) return 'No user from google';
    const { email: emailAddress, userName, picture } = req.user;

    // Check whether user not exist, if not, create new user
    let user = await this.userRepository.findOneBy({ emailAddress });
    if (!user) {
      try {
        user = await this.userRepository.save({
          userName,
          emailAddress,
          picture,
          role: RoleTypes.USER,
          permission: PermissionTypes.COMMENT,
        });
        const emailTilte = 'Welcom! You are signup successfully';
        await this.emailService.sendSignupMail(
          emailAddress,
          emailTilte,
          frontendURL,
        );

        // await this.mailerService.sendMail({
        //   to: emailAddress,
        //   subject: emailTilte,
        //   template: './template',
        //   context: {
        //     url: frontendURL,
        //     action: 'go to the Media Blog',
        //   },
        // });
      } catch (error) {
        throw new BadRequestException(error);
      }
    }

    // Check whether token of user login exist or not
    const tokens = this.getTokens(user);
    const foundAuth = await this.authRepository
      .createQueryBuilder('auth')
      .where('auth.userId = :userId', { userId: user.id })
      .andWhere('auth.refreshToken IS NOT NULL')
      .getOne();
    if (!foundAuth) {
      // Create new token for user
      await this.authRepository.save({
        ...tokens,
        userId: user.id,
      });
    } else {
      // Update exist token for user
      await this.authRepository.save({
        ...tokens,
        id: foundAuth.id,
      });
    }

    return {
      message: 'Sign in user account successfully via google',
      data: tokens,
    };
  }

  async facebookLogin(req) {
    // const { frontendURL } = new ConfigService();
    if (!req.user) return 'No user from facebook';
    // const { email: emailAddress, userName, picture } = req.user;
    console.log('FACEBOOK', req.user);

    // Check whether user not exist, if not, create new user
    // let user = await this.userRepository.findOneBy({ emailAddress });
    // if (!user) {
    //   try {
    //     user = await this.userRepository.save({
    //       userName,
    //       emailAddress,
    //       picture,
    //       role: RoleTypes.USER,
    //       permission: PermissionTypes.COMMENT,
    //     });
    //     const emailTilte = 'Welcom! You are signup successfully';
    //     await this.emailService.sendSignupMail(
    //       emailAddress,
    //       emailTilte,
    //       frontendURL,
    //     );
    //   } catch (error) {
    //     throw new BadRequestException(error);
    //   }
    // }

    // // Check whether token of user login exist or not
    // const tokens = this.getTokens(user);
    // const foundAuth = await this.authRepository
    //   .createQueryBuilder('auth')
    //   .where('auth.userId = :userId', { userId: user.id })
    //   .andWhere('auth.refreshToken IS NOT NULL')
    //   .getOne();
    // if (!foundAuth) {
    //   // Create new token for user
    //   await this.authRepository.save({
    //     ...tokens,
    //     userId: user.id,
    //   });
    // } else {
    //   // Update exist token for user
    //   await this.authRepository.save({
    //     ...tokens,
    //     id: foundAuth.id,
    //   });
    // }

    // return {
    //   message: 'Sign in user account successfully via google',
    //   data: tokens,
    // };
  }
}
