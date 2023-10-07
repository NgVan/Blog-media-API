import { Module } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryController } from './category.controller';
import { SharedModule } from '../shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { AbstractEntity } from '../../database/entities/abstract.entity';
import { SubCategoryController } from './subCategory.controller';
import { SubCategoryService } from './services/subCategory.service';
import { SubCategoryEntity } from './entities/subCategory.entity';
import { PostEntity } from '../post/entities/post.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserPostEntity } from '../post/entities/userpost.entity';

@Module({
  controllers: [CategoryController, SubCategoryController],
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      CategoryEntity,
      SubCategoryEntity,
      AbstractEntity,
      PostEntity,
      UserEntity,
      UserPostEntity,
    ]),
  ],
  providers: [CategoryService, SubCategoryService],
})
export class CategoryModule {}
