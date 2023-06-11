// import {
//     BadRequestException,
//     ConflictException,
//     HttpStatus,
//     Injectable,
//     NotFoundException,
//   } from '@nestjs/common';
//   import { Repository, DataSource, Brackets, In } from 'typeorm';
//   import { InjectRepository } from '@nestjs/typeorm';
//   import { get, isEmpty, omit } from 'lodash';
//   import { ConfigService } from '../../shared/services/config.service';
//   import { RequestContext } from '../../../utils/request-context';
//   import { validatePassword } from 'src/utils/utils';
//   import { BaseService } from 'src/database/services/base.service';

//   @Injectable()
//   export class PostService extends BaseService {
//     constructor(
//       private dataSource: DataSource,

//       @InjectRepository(UserEntity)
//       private userRepository: Repository<PostEntity>,
//       // @InjectRepository(RoleEntity)
//       // private roleRepository: Repository<RoleEntity>,

//       // private imageService: ImageService,
//       // private auth0Service: Auth0Service,
//       // private userVerificationService: UserVerificationService,
//       // private userRoleService: UserRoleService,
//       // private userOrganizationService: UserOrganizationService,
//       // private organizationService: OrganizationService,

//       // private emailService: EmailService,
//       private configService: ConfigService,
//     ) {
//       super(userRepository, 'User');
//     }

//     async signup(context: RequestContext, payload: UserSignupDto): Promise<any> {
//       const { emailAddress } = payload;

//       // const requestOrganizationId = get(context, 'user.currentUser.organizations[0].organizationId', null);

//       // if (requestOrganizationId && !organizationId) {
//       //   throw new BadRequestException('organizationId is required');
//       // }
//       // if (!isEmpty(roleIds)) {
//       //   const roles = await this.roleRepository.findBy({ id: In(roleIds) });
//       //   if (roles.find((r) => r.level === SystemRoleLevel.ORGANIZATION_ADMIN) && !organizationId) {
//       //     throw new BadRequestException('organizationId is required');
//       //   }
//       // }

//       const checkExistedUser = await this.userRepository.findOneBy({
//         emailAddress,
//       });
//       if (checkExistedUser)
//         throw new ConflictException('User has already conflicted');

//       let user: any;
//       try {
//         // Create user in DB
//         user = await this.userRepository.save({
//           ...payload,
//         });
//       } catch (error) {
//         throw new BadRequestException(error);
//       }
//       return await this.getUserProfile(context, user.id);
//     }

//     async updateUser(
//       context: RequestContext,
//       payload: any,
//       id: string,
//     ): Promise<UserDto> {
//       const user = await this.userRepository.findOneBy({ id });
//       if (!user) throw new NotFoundException('User not found');
//       if (isEmpty(payload)) throw new BadRequestException('Body is required');

//       try {
//         await this.userRepository.save({
//           id: user.id,
//           ...omit(payload, ['password', 'emailAddress']),
//         });
//       } catch (error) {
//         throw new BadRequestException('Update user fail');
//       }

//       return this.getUserProfile(context, user.id);
//     }

//     async getUserProfile(_context: RequestContext, id: string): Promise<UserDto> {
//       const data = await this.userRepository.findOneBy({ id });
//       if (!data) throw new NotFoundException('User not found');
//       const userDto = new UserDto(data);

//       return <UserDto>omit(userDto);
//     }

//     async changeUserPassword(
//       _context: RequestContext,
//       payload: any,
//       id: string,
//     ): Promise<any> {
//       const { currentPassword, newPassword, newPasswordConfirm } = payload;
//       const user = await this.userRepository.findOneBy({ id });
//       if (!user) throw new NotFoundException('User not found');

//       if (user.password !== currentPassword)
//         throw new BadRequestException('Current password is incorrect');

//       if (!validatePassword(newPassword))
//         throw new BadRequestException('Invalid Password!');

//       if (newPassword !== newPasswordConfirm)
//         throw new BadRequestException(
//           'Confirm password not match with new password',
//         );

//       try {
//         await this.userRepository.save({
//           id: user.id,
//           password: newPassword,
//         });
//       } catch (error) {
//         throw new BadRequestException('Change user password fail');
//       }
//       return {
//         status: HttpStatus.OK,
//         message: 'Change user password successful',
//       };
//     }

//     async findUser(emailAddress: string): Promise<any> {
//       const user = await this.userRepository.findOneBy({ emailAddress });
//       return user;
//     }
//   }
