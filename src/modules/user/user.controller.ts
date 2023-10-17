import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Post,
  Put,
  Req,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UserService } from './services/user.service';
import { SUCCESS } from '../../utils/constant';
import { UserDto } from './dtos/response/user.dto';
import { AppRequest } from '../../utils/app-request';
import { UserCreateDto } from './dtos/request/user-signup.dto';
import { UserUpdateDto } from './dtos/request/user-update.dto';
import { UserQueryDto } from './dtos/request/user-quey.dto';
import { UserFilterDto } from './dtos/response/user-filter.dto';
import { AccessTokenGuard } from '../auth/guards/auth.guard';
import { UserUpdateProfileDto } from './dtos/request/user-update-profile.dto';
import { PermissionsGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/guards/list.decorator';
import { PermissionTypes } from 'src/utils/enum';
import { LikePostDto } from './dtos/request/user-like-post.dto';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('user')
@UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: SUCCESS,
    type: UserDto,
  })
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Permissions(PermissionTypes.USER)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Req() request: AppRequest,
    @Body() payload: UserCreateDto,
  ): Promise<UserDto> {
    return this.userService.createUser(request, payload);
  }

  @ApiOperation({ summary: 'Update User' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
    type: UserDto,
  })
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Permissions(PermissionTypes.USER)
  @HttpCode(HttpStatus.OK)
  @Put(':userId')
  update(
    @Req() request: AppRequest,
    @Param('userId') userId: string,
    @Body() payload: UserUpdateDto,
  ): Promise<UserDto> {
    return this.userService.updateUser(request, payload, userId);
  }

  @ApiOperation({ summary: 'Get List User By Filter' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
    type: UserFilterDto,
  })
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Permissions(PermissionTypes.COMMENT)
  @HttpCode(HttpStatus.OK)
  @Get('Filter')
  getList(
    @Req() request: AppRequest,
    @Query() filter: UserQueryDto,
  ): Promise<UserFilterDto> {
    return this.userService.getListUserByFilter(filter);
  }

  @ApiOperation({ summary: 'Get One User' })
  @ApiResponse({ status: HttpStatus.OK, description: SUCCESS, type: UserDto })
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Permissions(PermissionTypes.COMMENT)
  @HttpCode(HttpStatus.OK)
  @Get(':userId')
  getUserProfile(
    @Req() request: AppRequest,
    @Param('userId') userId: string,
  ): Promise<UserDto> {
    return this.userService.getUserProfile(request, userId);
  }

  @ApiOperation({ summary: 'Get Current User' })
  @ApiResponse({ status: HttpStatus.OK, description: SUCCESS, type: UserDto })
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  getCurrentUser(@Req() request: AppRequest): Promise<UserDto> {
    return this.userService.getCurrentUser(request);
  }

  @ApiOperation({ summary: 'Update Profile' })
  @ApiResponse({ status: HttpStatus.OK, description: SUCCESS, type: UserDto })
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Put()
  updateProfile(
    @Req() request: AppRequest,
    @Body() payload: UserUpdateProfileDto,
  ): Promise<UserDto> {
    return this.userService.updateProfile(request, payload);
  }

  @ApiOperation({ summary: 'Like Post' })
  @ApiResponse({ status: HttpStatus.OK, description: SUCCESS })
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Put('/post/:postId')
  likePost(
    @Req() request: AppRequest,
    @Param('postId') postId: string,
  ): Promise<UserDto> {
    return this.userService.likePost(request, postId);
  }

  @ApiOperation({ summary: 'Admin Access Post' })
  @ApiResponse({ status: HttpStatus.OK, description: SUCCESS })
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Permissions(PermissionTypes.FLATFORM_ADMIN)
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Put('/post/access/:postId')
  accessPost(@Param('postId') postId: string): Promise<UserDto> {
    return this.userService.accessPost(postId);
  }

  @ApiOperation({ summary: 'Delete One User' })
  @ApiResponse({ status: HttpStatus.OK, description: SUCCESS, type: Boolean })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Permissions(PermissionTypes.USER)
  @Delete(':userId')
  delete(@Param('userId') id: string): Promise<any> {
    return this.userService.softDelete(id);
  }
}
