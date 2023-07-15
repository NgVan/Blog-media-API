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
import { CatQueryDto } from './dtos/request/CatQuery.dto';
import { SubCategoryService } from './services/subCategory.service';
import { SubCategoryDto } from './dtos/response/subCat.dto';
import { SubCatCreateDto } from './dtos/request/subCat-create.dto';
import { SubCatUpdateDto } from './dtos/request/subCat-update.dto';
import { SubCatFilterDto } from './dtos/response/subcat-filter.dto';
import { PermissionTypes } from 'src/utils/enum';
import { PermissionsGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/guards/list.decorator';

@ApiTags('SubCategories')
@Controller('subcategory')
@UsePipes(new ValidationPipe({ transform: true }))
export class SubCategoryController {
  constructor(private subCategoryService: SubCategoryService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Sub-Category' })
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Permissions(PermissionTypes.POST)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: SUCCESS,
  })
  @Post()
  create(@Body() payload: SubCatCreateDto): Promise<SubCategoryDto> {
    return this.subCategoryService.create(payload);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Sub-Category' })
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Permissions(PermissionTypes.POST)
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
  })
  @Put(':subCategoryId')
  update(
    @Param('subCategoryId') id: string,
    @Body() payload: SubCatUpdateDto,
  ): Promise<SubCategoryDto> {
    return this.subCategoryService.update(payload, id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get List Sub-Category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
  })
  @Get('filter')
  getList(
    @Req() request: AppRequest,
    @Query() filter: CatQueryDto,
  ): Promise<SubCatFilterDto> {
    return this.subCategoryService.getList(filter);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get One Sub-Category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
  })
  @Get(':subCategoryId')
  getOne(
    @Req() request: AppRequest,
    @Param('subCategoryId') id: string,
  ): Promise<SubCategoryDto> {
    return this.subCategoryService.getOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete Sub-Category' })
  @UseGuards(AccessTokenGuard, PermissionsGuard)
  @Permissions(PermissionTypes.POST)
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
  })
  @Delete(':subCategoryId')
  delete(@Param('subCategoryId') id: string): Promise<any> {
    return this.subCategoryService.delete(id);
  }
}
