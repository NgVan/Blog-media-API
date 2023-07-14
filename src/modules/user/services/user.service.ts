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
import { UserSignupDto } from '../dtos/request/user-signup.dto';
import { BaseService } from 'src/database/services/base.service';

@Injectable()
export class UserService extends BaseService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    // @InjectRepository(RoleEntity)
    // private roleRepository: Repository<RoleEntity>,

    // private imageService: ImageService,
    // private auth0Service: Auth0Service,
    // private userVerificationService: UserVerificationService,
    // private userRoleService: UserRoleService,
    // private userOrganizationService: UserOrganizationService,
    // private organizationService: OrganizationService,

    // private emailService: EmailService,
    private configService: ConfigService,
  ) {
    super(userRepository, 'User');
  }

  async signup(context: RequestContext, payload: UserSignupDto): Promise<any> {
    const { emailAddress } = payload;

    // const requestOrganizationId = get(context, 'user.currentUser.organizations[0].organizationId', null);

    // if (requestOrganizationId && !organizationId) {
    //   throw new BadRequestException('organizationId is required');
    // }
    // if (!isEmpty(roleIds)) {
    //   const roles = await this.roleRepository.findBy({ id: In(roleIds) });
    //   if (roles.find((r) => r.level === SystemRoleLevel.ORGANIZATION_ADMIN) && !organizationId) {
    //     throw new BadRequestException('organizationId is required');
    //   }
    // }

    const checkExistedUser = await this.userRepository.findOneBy({
      emailAddress,
    });
    if (checkExistedUser)
      throw new ConflictException('User has already conflicted');

    let user: any;
    try {
      // Create user in DB
      user = await this.userRepository.save({
        ...payload,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
    return await this.getUserProfile(context, user.id);
  }

  async updateUser(
    context: RequestContext,
    payload: any,
    id: string,
  ): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    if (isEmpty(payload)) throw new BadRequestException('Body is required');

    try {
      await this.userRepository.save({
        id: user.id,
        ...omit(payload, ['password', 'emailAddress']),
      });
    } catch (error) {
      throw new BadRequestException('Update user fail');
    }

    return this.getUserProfile(context, user.id);
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
        userName: data.fullName,
        ...omit(data, [
          'id',
          'fullName',
          'emailVerified',
          'created',
          'modified',
          'deleted',
          'password',
        ]),
      },
      message: 'Get  current user successfully',
    };

    // const userDto = new UserDto(data);

    // return <UserDto>omit(userDto);
  }

  async findUser(emailAddress: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ emailAddress });
    return user;
  }
}
