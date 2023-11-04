import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource, Brackets } from 'typeorm';
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
import { AuthEntity } from 'src/modules/auth/entities/auth.entity';
import { UserPostEntity } from 'src/modules/post/entities/userpost.entity';
import { PostEntity } from 'src/modules/post/entities/post.entity';
import { UserQueryDto } from '../dtos/request/user-quey.dto';
import { FollowUserEntity } from '../entities/followUser.entity';

@Injectable()
export class UserService extends BaseService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
    @InjectRepository(UserPostEntity)
    private userPostRepository: Repository<UserPostEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(FollowUserEntity)
    private followUserRepository: Repository<FollowUserEntity>,
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
    if (!permissions.includes('COMMENT'))
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
        follower: 0,
        following: 0,
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
    if (permissions) permissions.push(PermissionTypes.COMMENT);

    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    if (isEmpty(payload)) throw new BadRequestException('Body is required');

    try {
      await this.userRepository.save({
        id: user.id,
        ...omit(payload, 'permissions'),
        permission: permissions ? permissions.join('-') : user?.permission,
      });
    } catch (error) {
      throw new BadRequestException('Update user fail');
    }

    return {
      data: await this.getUserProfile(context, user.id),
      message: 'Update user successfully',
    };
  }

  async getListUserByFilter(
    context: RequestContext,
    filterParam: UserQueryDto,
  ): Promise<any> {
    const user = get(context, 'user');
    const {
      page = DEFAULT_VALUE_FILTER.PAGE,
      limit = DEFAULT_VALUE_FILTER.LIMIT,
      userName,
    } = filterParam;
    const totalSkip = (page - 1) * limit;

    const query = this.userRepository
      .createQueryBuilder('user')
      .where(
        new Brackets((query) => {
          query
            .where('user.userName LIKE :userName')
            .orWhere('user.displayName LIKE :userName');
        }),
      )
      .setParameters({ userName: `%${userName.trim()}%` })
      .take(limit)
      .skip(totalSkip);

    const [result, total] = await query.clone().getManyAndCount();
    const res = result.map((user) => new UserDto(user));

    // Kiểm tra xem User_A đã theo dõi những User nào trong danh sách User được tìm thấy?
    const findFollowUser = await this.followUserRepository.findBy({
      followerId: user.sub,
    });
    const trackedUserId = findFollowUser.map((i) => i.trackedUserId);
    const addFollowStatusRes = res.map((i) => {
      return {
        ...i,
        followUserStatus: trackedUserId.includes(i.id),
      };
    });

    return {
      entities: addFollowStatusRes,
      totalEntities: total,
    };
  }

  async getUserProfile(context: RequestContext, id: string): Promise<any> {
    const user = get(context, 'user');
    const data = await this.userRepository.findOneBy({ id });
    if (!data) throw new NotFoundException('User not found');

    // find total like number of all post created this user
    let totalPostLike = 0;
    const findPosts = await this.postRepository.findBy({ userId: id });
    findPosts.forEach((i) => {
      totalPostLike += i.like;
    });

    // Check whether User_A follow User_B or not?
    const findFollowUser = await this.followUserRepository.findOneBy({
      followerId: user.sub,
      trackedUserId: id,
    });
    const followUserStatus = findFollowUser ? true : false;

    const userDto = new UserDto(data);

    return { ...(<UserDto>omit(userDto)), totalPostLike, followUserStatus };
  }

  async getCurrentUser(context: RequestContext): Promise<any> {
    const user = get(context, 'user');
    const data = await this.userRepository.findOneBy({ id: user.sub });
    if (!data) throw new NotFoundException('User not found');

    // find total like number of all post created this user
    let totalPostLike = 0;
    const findPosts = await this.postRepository.findBy({ userId: user.sub });
    findPosts.forEach((i) => {
      totalPostLike += i.like;
    });
    return {
      data: {
        ...omit(data, ['deleted', 'password', 'permission']),
        permissions: data.permission.split('-'),
        totalPostLike,
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

  async likePost(context: RequestContext, postId: string): Promise<any> {
    try {
      const user = get(context, 'user');

      const data = await this.userRepository.findOneBy({ id: user.sub });
      if (!data) throw new NotFoundException('User not found');
      const findPost = await this.postRepository.findOneBy({ id: postId });
      if (!findPost) throw new NotFoundException('Post not found');

      const findUserPost = await this.userPostRepository.findOneBy({
        userId: user.sub,
        postId,
      });
      let result = '';
      if (!findUserPost) {
        await this.userPostRepository.save({
          userId: user.sub,
          postId,
        });
        await this.postRepository.save({
          id: postId,
          like: findPost.like + 1,
        });
        result = 'Like Post Successfully';
      } else {
        await this.userPostRepository.delete({ userId: user.sub, postId });
        await this.postRepository.save({
          id: postId,
          like: findPost.like - 1,
        });
        result = 'DisLike Post Successfully';
      }
      return { message: result };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async followUser(context: RequestContext, userId: string): Promise<any> {
    try {
      const user = get(context, 'user');
      // Find User_A
      const followerUser = await this.userRepository.findOneBy({
        id: user.sub,
      });
      if (!followerUser) throw new NotFoundException('Follower user not found');

      // Find User_B
      const trackedUser = await this.userRepository.findOneBy({ id: userId });
      if (!trackedUser) throw new NotFoundException('Tracker user not found');

      const findFollowUser = await this.followUserRepository.findOneBy({
        followerId: user.sub,
        trackedUserId: userId,
      });
      let result = '';
      if (!findFollowUser) {
        // Tình huống: User_A theo dõi User_B
        await this.followUserRepository.save({
          followerId: user.sub, // User_A
          trackedUserId: userId, // User_B
        });

        // Update User_A: cột "Đang theo dõi (following)"": tăng lên 1
        await this.userRepository.save({
          id: user.sub,
          following: followerUser.following + 1,
        });

        // Update User_B: cột "Follower (follower)"": tăng lên 1
        await this.userRepository.save({
          id: userId,
          follower: trackedUser.follower + 1,
        });
        result = 'Follow User Successfully';
      } else {
        // Tình huống: User_A hủy theo dõi User_B
        await this.followUserRepository.delete({
          followerId: user.sub, // User_A
          trackedUserId: userId, // User_B
        });

        // Update User_A: cột "Đang theo dõi (following)"": giảm đi 1
        await this.userRepository.save({
          id: user.sub,
          following: followerUser.following - 1,
        });

        // Update User_B: cột "Follower (follower)"": giảm đi 1
        await this.userRepository.save({
          id: userId,
          follower: trackedUser.follower - 1,
        });
        result = 'Un-follow User Successfully';
      }
      return { message: result };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async accessPost(postId: string): Promise<any> {
    try {
      const findPost = await this.postRepository.findOneBy({ id: postId });
      if (!findPost) throw new NotFoundException('Post not found');
      if (findPost.isAccess)
        throw new BadRequestException('Post already is accepted');
      await this.postRepository.save({
        id: postId,
        isAccess: 1,
      });
      return { message: 'Accept Post Successfully' };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findUser(emailAddress: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ emailAddress });
    return user;
  }

  async softDelete(id: string): Promise<any> {
    const data = await this.userRepository.findOneBy({ id });
    if (!data) throw new NotFoundException(`User not found`);
    await this.userRepository.softDelete(id);
    await this.authRepository.delete({ userId: id });
    return {
      message: `Delete user successfully`,
    };
  }
}
