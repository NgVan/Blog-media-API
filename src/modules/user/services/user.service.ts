import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { get, isEmpty, omit } from 'lodash';
import { ConfigService } from '../../shared/services/config.service';
import { RequestContext } from '../../../utils/request-context';
import { UserDto } from '../dtos/response/user.dto';
import { UserCreateDto } from '../dtos/request/user-signup.dto';
import { BaseService } from 'src/database/services/base.service';
import { UserUpdateProfileDto } from '../dtos/request/user-update-profile.dto';
import { AbstractFilterDto } from 'src/database/dtos/abstract-filter.dto';
import { DEFAULT_VALUE_FILTER } from 'src/utils/constant';
import * as bcrypt from 'bcrypt';
import { PermissionTypes, RoleTypes } from 'src/utils/enum';

@Injectable()
export class UserService extends BaseService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {
    super(userRepository, 'User');
  }

  async createUser(
    context: RequestContext,
    payload: UserCreateDto,
  ): Promise<any> {
    const { emailAddress, password, permissions } = payload;
    console.log({ password, permissions });
    permissions.push(PermissionTypes.COMMENT);
    const checkExistedUser = await this.userRepository.findOneBy({
      emailAddress,
    });
    if (checkExistedUser)
      throw new ConflictException('User has already conflicted');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    let user: any;
    try {
      // Create user in DB
      user = await this.userRepository.save({
        ...omit(payload, ['password', 'permissions']),
        password: hashedPassword,
        role: RoleTypes.USER,
        permission: permissions.join('-'),
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
    return {
      data: await this.getUserProfile(context, user.id),
      message: 'Create user successfully',
    };
  }

  async updateUser(
    context: RequestContext,
    payload: any,
    id: string,
  ): Promise<any> {
    const { permissions } = payload;
    permissions.push(PermissionTypes.COMMENT);

    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    if (isEmpty(payload)) throw new BadRequestException('Body is required');

    try {
      await this.userRepository.save({
        id: user.id,
        ...omit(payload, 'permissions'),
        permission: permissions.join('-'),
      });
    } catch (error) {
      throw new BadRequestException('Update user fail');
    }

    return {
      data: await this.getUserProfile(context, user.id),
      message: 'Update user successfully',
    };
  }

  async getListUserByFilter(filterParam: AbstractFilterDto): Promise<any> {
    const {
      page = DEFAULT_VALUE_FILTER.PAGE,
      limit = DEFAULT_VALUE_FILTER.LIMIT,
    } = filterParam;
    const totalSkip = (page - 1) * limit;

    const [result, total] = await this.userRepository.findAndCount({
      take: limit,
      skip: totalSkip,
      // withDeleted: withDeleted?.toString() === 'true',
    });
    const res = result.map((user) => new UserDto(user));
    console.log({ result, total });

    return {
      entities: res,
      totalEntities: total,
    };
  }

  async getUserProfile(_context: RequestContext, id: string): Promise<UserDto> {
    const data = await this.userRepository.findOneBy({ id });
    if (!data) throw new NotFoundException('User not found');
    const userDto = new UserDto(data);

    return <UserDto>omit(userDto);
  }

  async getCurrentUser(context: RequestContext): Promise<any> {
    const user = get(context, 'user');
    const data = await this.userRepository.findOneBy({ id: user.sub });
    if (!data) throw new NotFoundException('User not found');
    return {
      data: {
        ...omit(data, [
          'id',
          'emailVerified',
          'created',
          'modified',
          'deleted',
          'password',
          'permission',
        ]),
        permissions: data.permission.split('-'),
      },
      message: 'Get current user successfully',
    };

    // const userDto = new UserDto(data);

    // return <UserDto>omit(userDto);
  }

  async updateProfile(
    context: RequestContext,
    payload: UserUpdateProfileDto,
  ): Promise<any> {
    const { userName, phoneNumber, picture } = payload;
    const user = get(context, 'user');
    const data = await this.userRepository.findOneBy({ id: user.sub });
    if (!data) throw new NotFoundException('User not found');
    try {
      await this.userRepository.save({
        id: data.id,
        userName,
        phoneNumber,
        picture,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
    const foundUser = await this.userRepository.findOneBy({ id: data.id });
    return {
      data: {
        ...omit(foundUser, [
          'id',
          'emailVerified',
          'created',
          'modified',
          'deleted',
          'password',
          'permission',
        ]),
        permissions: foundUser.permission.split('-'),
      },
      message: 'Update current user successfully',
    };
  }

  async findUser(emailAddress: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ emailAddress });
    return user;
  }
}
