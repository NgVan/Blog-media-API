// import {
//   Body,
//   Controller,
//   Get,
//   HttpCode,
//   HttpStatus,
//   Param,
//   Query,
//   Post,
//   Put,
//   Req,
//   Delete,
//   UseGuards,
//   UsePipes,
//   ValidationPipe,
//   Patch,
// } from '@nestjs/common';
// import {
//   ApiTags,
//   ApiBearerAuth,
//   ApiOperation,
//   ApiConsumes,
//   ApiBody,
//   ApiResponse,
// } from '@nestjs/swagger';

// import { UserService } from './services/user.service';
// import { LIMIT_SIZE, SUCCESS } from '../../utils/constant';
// import { UserDto } from './dtos/response/user.dto';
// import { AppRequest } from '../../utils/app-request';
// import { UserSignupDto } from './dtos/request/user-signup.dto';
// import { UserUpdateDto } from './dtos/request/user-update.dto';
// import { UserChangePasswordDto } from './dtos/request/user-change-password.dto';
// import { UserQueryDto } from './dtos/request/user-quey.dto';
// import { UserFilterDto } from './dtos/response/user-filter.dto';
// import { AccessTokenGuard } from '../auth/guards/auth.guard';

// @ApiTags('Posts')
// @ApiBearerAuth('access-token')
// @Controller('post')
// @UsePipes(new ValidationPipe({ transform: true }))
// export class PostController {
//   constructor(private userService: PostService) {}

//   @ApiOperation({ summary: 'Create User' })
//   @ApiResponse({
//     status: HttpStatus.CREATED,
//     description: SUCCESS,
//     type: UserDto,
//   })
//   @UseGuards(AccessTokenGuard)
//   @HttpCode(HttpStatus.CREATED)
//   @Post()
//   create(
//     @Req() request: AppRequest,
//     @Body() payload: UserSignupDto,
//   ): Promise<UserDto> {
//     return this.userService.signup(request, payload);
//   }

//   @ApiOperation({ summary: 'Update User' })
//   @ApiResponse({
//     status: HttpStatus.OK,
//     description: SUCCESS,
//     type: UserDto,
//   })
//   @UseGuards(AccessTokenGuard)
//   //   @UseGuards(AccessTokenGuard, PermissionsGuard)
//   //   @Permissions(SystemPermissionTypes.ADD_USER)
//   //   @RequiredIn(RequiredInTypes.BODY)
//   @HttpCode(HttpStatus.OK)
//   @Put(':userId')
//   update(
//     @Req() request: AppRequest,
//     @Param('userId') userId: string,
//     @Body() payload: UserUpdateDto,
//   ): Promise<UserDto> {
//     return this.userService.updateUser(request, payload, userId);
//   }

//   @ApiOperation({ summary: 'Change user password' })
//   @ApiResponse({ status: HttpStatus.OK, description: SUCCESS })
//   @UseGuards(AccessTokenGuard)
//   @HttpCode(HttpStatus.OK)
//   @Patch('change-password/:userId')
//   changeUserPassword(
//     @Req() request: AppRequest,
//     @Param('userId') userId: string,
//     @Body() payload: UserChangePasswordDto,
//   ) {
//     return this.userService.changeUserPassword(request, payload, userId);
//   }

//   @ApiOperation({ summary: 'Get List User By Filter' })
//   @ApiResponse({
//     status: HttpStatus.OK,
//     description: SUCCESS,
//     type: UserFilterDto,
//   })
//   @UseGuards(AccessTokenGuard)
//   @HttpCode(HttpStatus.OK)
//   @Get('Filter')
//   getList(
//     @Req() request: AppRequest,
//     @Query() filter: UserQueryDto,
//   ): Promise<UserFilterDto> {
//     return this.userService.getListByFilter(filter);
//   }

//   @ApiOperation({ summary: 'Get One User' })
//   @ApiResponse({ status: HttpStatus.OK, description: SUCCESS, type: UserDto })
//   @UseGuards(AccessTokenGuard)
//   //   @UseGuards(AccessTokenGuard, PermissionsGuard)
//   //   @IsSelf(true)
//   //   @Permissions(SystemPermissionTypes.VIEW_DETAIL_USER)
//   //   @RequiredIn(RequiredInTypes.PARAMS)
//   @HttpCode(HttpStatus.OK)
//   @Get(':userId')
//   getUserProfile(
//     @Req() request: AppRequest,
//     @Param('userId') userId: string,
//   ): Promise<UserDto> {
//     return this.userService.getUserProfile(request, userId);
//   }

//   @ApiOperation({ summary: 'Delete One User' })
//   @ApiResponse({ status: HttpStatus.OK, description: SUCCESS, type: Boolean })
//   @HttpCode(HttpStatus.OK)
//   @UseGuards(AccessTokenGuard)
//   //   @Permissions(SystemPermissionTypes.DELETE_LOCATION)
//   //   @RequiredIn(RequiredInTypes.PARAMS)
//   @Delete(':userId')
//   delete(@Param('userId') id: string): Promise<boolean> {
//     return this.userService.softDelete(id);
//   }
// }
// //f0611acf-1920-4283-aaad-965c315fc331
