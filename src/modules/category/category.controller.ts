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
import { CategoryService } from './services/category.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SUCCESS } from 'src/utils/constant';
import { AccessTokenGuard } from '../auth/guards/auth.guard';
import { CreateCatDto } from './dtos/request/createCat.dto';
import { UpdateCatDto } from './dtos/request/updateCat.dto';
import { AppRequest } from 'src/utils/app-request';
import { CategoryDto } from './dtos/response/cat.dto';
import { CatQueryDto } from './dtos/request/CatQuery.dto';
import { CatFilterDto } from './dtos/response/cat-filter.dto';

@ApiTags('Categories')
@Controller('category')
@UseGuards(AccessTokenGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Category' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: SUCCESS,
  })
  @Post()
  create(@Body() payload: CreateCatDto): Promise<CategoryDto> {
    return this.categoryService.create(payload);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
  })
  @Put(':categoryId')
  update(
    @Param('categoryId') id: string,
    @Body() payload: UpdateCatDto,
  ): Promise<CategoryDto> {
    return this.categoryService.update(payload, id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get List Category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
  })
  @Get('filter')
  getList(
    @Req() request: AppRequest,
    @Query() filter: CatQueryDto,
  ): Promise<CatFilterDto> {
    return this.categoryService.getList(filter);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get One Category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
  })
  @Get(':categoryId')
  getOne(
    @Req() request: AppRequest,
    @Param('categoryId') id: string,
  ): Promise<CategoryDto> {
    return this.categoryService.getOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete Category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS,
  })
  @Delete(':categoryId')
  delete(@Param('categoryId') id: string): Promise<any> {
    return this.categoryService.delete(id);
  }
}
