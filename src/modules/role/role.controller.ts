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
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

import { RoleService } from './services/role.service';
import { LIMIT_SIZE, SUCCESS } from '../../utils/constant';
import { RoleDto } from './dtos/response/role.dto';
import { AppRequest } from '../../utils/app-request';
import { RoleUpdateDto } from './dtos/request/role-update.dto';
import { RoleQueryDto } from './dtos/request/role-quey.dto';
import { RoleFilterDto } from './dtos/response/role-filter.dto';
import { RoleCreateDto } from './dtos/request/role-create.dto';

@ApiTags('Roles')
@Controller('roles')
@UsePipes(new ValidationPipe({ transform: true }))
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiOperation({ summary: 'Create Role' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: SUCCESS,
    type: RoleDto,
  })
  //   @UseGuards(JwtAuthGuard, PermissionsGuard)
  //   @Permissions(SystemPermissionTypes.ADD_USER)
  //   @RequiredIn(RequiredInTypes.BODY)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Req() request: AppRequest,
    @Body() payload: RoleCreateDto,
  ): Promise<RoleDto> {
    return this.roleService.createRole(request, payload);
  }

  @ApiOperation({ summary: 'Update Role' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
    type: RoleDto,
  })
  //   @UseGuards(JwtAuthGuard, PermissionsGuard)
  //   @Permissions(SystemPermissionTypes.ADD_USER)
  //   @RequiredIn(RequiredInTypes.BODY)
  @HttpCode(HttpStatus.OK)
  @Put(':roleId')
  update(
    @Req() request: AppRequest,
    @Param('roleId') roleId: string,
    @Body() payload: RoleUpdateDto,
  ): Promise<RoleDto> {
    return this.roleService.updateRole(request, payload, roleId);
  }

  @ApiOperation({ summary: 'Get List Role By Filter' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
    type: RoleFilterDto,
  })
  //   @UseGuards(JwtAuthGuard, PermissionsGuard)
  @HttpCode(HttpStatus.OK)
  @Get('Filter')
  getList(
    @Req() request: AppRequest,
    @Query() filter: RoleQueryDto,
  ): Promise<RoleFilterDto> {
    return this.roleService.getListByFilter(filter);
  }

  @ApiOperation({ summary: 'Get One Role' })
  @ApiResponse({ status: HttpStatus.OK, description: SUCCESS, type: RoleDto })
  //   @UseGuards(JwtAuthGuard, PermissionsGuard)
  //   @IsSelf(true)
  //   @Permissions(SystemPermissionTypes.VIEW_DETAIL_USER)
  //   @RequiredIn(RequiredInTypes.PARAMS)
  @HttpCode(HttpStatus.OK)
  @Get(':roleId')
  getOne(
    @Req() request: AppRequest,
    @Param('roleId') roleId: string,
  ): Promise<RoleDto> {
    return this.roleService.getRole(request, roleId);
  }

  @ApiOperation({ summary: 'Delete One Role' })
  @ApiResponse({ status: HttpStatus.OK, description: SUCCESS, type: Boolean })
  @HttpCode(HttpStatus.OK)
  //   @Permissions(SystemPermissionTypes.DELETE_LOCATION)
  //   @RequiredIn(RequiredInTypes.PARAMS)
  @Delete(':roleId')
  delete(@Param('roleId') id: string): Promise<boolean> {
    return this.roleService.softDelete(id);
  }
}
