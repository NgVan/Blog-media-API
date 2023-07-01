import { Module } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryController } from './category.controller';
import { SharedModule } from '../shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { SubCategoryEntity } from './entities/subcategory.entity';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { SubCategoryController } from './subCategory.controller';
import { SubCategoryService } from './services/subCategory.service';

@Module({
  controllers: [CategoryController, SubCategoryController],
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      CategoryEntity,
      SubCategoryEntity,
      AbstractEntity,
    ]),
  ],
  providers: [CategoryService, SubCategoryService],
})
export class CategoryModule {}
