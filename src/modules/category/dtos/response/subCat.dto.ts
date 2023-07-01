import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'src/database/dtos/abstract.dto';
import { SubCategoryEntity } from 'src/modules/category/entities/subcategory.entity';
import { CategoryEntity } from '../../entities/category.entity';

export class SubCategoryDto extends AbstractDto {
  constructor(subCategoryEntity: SubCategoryEntity = <SubCategoryEntity>{}) {
    super(subCategoryEntity);
    this.name = subCategoryEntity.name;
    this.category = subCategoryEntity.category;
  }
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  category: CategoryEntity;
}
