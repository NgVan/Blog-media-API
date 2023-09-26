import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Get,
  Req,
  Param,
  Put,
  Query,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SUCCESS } from 'src/utils/constant';
import { AccessTokenGuard } from '../auth/guards/auth.guard';
import { AppRequest } from 'src/utils/app-request';
import { PostService } from './services/post.service';
import { PostCreateDto } from './dtos/request/post-create.dto';
import { PostDto } from './dtos/response/post.dto';
import { PostUpdateDto } from './dtos/request/post-update.dto';
import { AbstractFilterDto } from 'src/database/dtos/abstract-filter.dto';
import { PostFilterDto } from './dtos/response/post-filter.dto';
import { PermissionsGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/guards/list.decorator';
import { PermissionTypes } from 'src/utils/enum';
import { PostQueryDto } from './dtos/request/post-query.dto';

@ApiTags('Posts')
@Controller('post')
@UsePipes(new ValidationPipe({ transform: true }))
export class PostController {
  constructor(private postService: PostService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Post' })
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Permissions(PermissionTypes.POST)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: SUCCESS,
  })
  @Post()
  create(
    @Req() request: AppRequest,
    @Body() payload: PostCreateDto,
  ): Promise<PostDto> {
    return this.postService.create(request, payload);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Post' })
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Permissions(PermissionTypes.POST)
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
  })
  @Put(':postId')
  update(
    @Param('postId') id: string,
    @Body() payload: PostUpdateDto,
  ): Promise<PostDto> {
    return this.postService.update(payload, id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get List Post' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
  })
  @Get('filter')
  getList(
    @Req() request: AppRequest,
    @Query() filter: PostQueryDto,
  ): Promise<any> {
    return this.postService.getList(filter);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get One Post' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
  })
  @Get(':postId')
  getOne(
    @Req() request: AppRequest,
    @Param('postId') id: string,
  ): Promise<PostDto> {
    return this.postService.getOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete post' })
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Permissions(PermissionTypes.POST)
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
  })
  @Delete(':postId')
  delete(@Param('postId') id: string): Promise<any> {
    return this.postService.delete(id);
  }
}
