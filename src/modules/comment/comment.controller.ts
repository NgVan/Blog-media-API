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
import { CommentService } from './services/comment.service';
import { CommentCreateDto } from './dtos/request/comment-create.dto';
import { CommentDto } from './dtos/response/comment.dto';
import { CommentUpdateDto } from './dtos/request/comment-update.dto';
import { AbstractFilterDto } from 'src/database/dtos/abstract-filter.dto';
import { CommentFilterDto } from './dtos/response/comment-filter.dto';
import { PermissionsGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/guards/list.decorator';
import { PermissionTypes } from 'src/utils/enum';

@ApiTags('Commnets')
@Controller('comment')
@UsePipes(new ValidationPipe({ transform: true }))
export class CommentController {
  constructor(private commentService: CommentService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Comment' })
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Permissions(PermissionTypes.POST)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: SUCCESS,
  })
  @Post()
  create(
    @Req() request: AppRequest,
    @Body() payload: CommentCreateDto,
  ): Promise<CommentDto> {
    return this.commentService.create(payload);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Comment' })
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Permissions(PermissionTypes.POST)
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
  })
  @Put(':postId')
  update(
    @Param('postId') id: string,
    @Body() payload: CommentUpdateDto,
  ): Promise<CommentDto> {
    return this.commentService.update(payload, id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get List Comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
  })
  @Get('filter')
  getList(
    @Req() request: AppRequest,
    @Query() filter: AbstractFilterDto,
  ): Promise<CommentFilterDto> {
    return this.commentService.getList(filter);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get One Comment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
  })
  @Get(':postId')
  getOne(
    @Req() request: AppRequest,
    @Param('postId') id: string,
  ): Promise<CommentDto> {
    return this.commentService.getOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete Comment' })
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Permissions(PermissionTypes.POST)
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
  })
  @Delete(':postId')
  delete(@Param('postId') id: string): Promise<any> {
    return this.commentService.delete(id);
  }
}
