import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'src/database/dtos/abstract.dto';
import { CategoryEntity } from '../../entities/category.entity';
import { SubCategoryEntity } from '../../entities/subCategory.entity';

export class CategoryDto extends AbstractDto {
  constructor(categoryEntity: CategoryEntity = <CategoryEntity>{}) {
    super(categoryEntity);
    this.name = categoryEntity.name;
    this.subCategory = categoryEntity.subCategorys;
  }
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  subCategory: SubCategoryEntity[];
}
