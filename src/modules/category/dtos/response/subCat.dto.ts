import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'src/database/dtos/abstract.dto';
import { CategoryEntity } from '../../entities/category.entity';
import { SubCategoryEntity } from '../../entities/subCategory.entity';

export class SubCategoryDto extends AbstractDto {
  constructor(subCategoryEntity: SubCategoryEntity = <SubCategoryEntity>{}) {
    super(subCategoryEntity);
    this.name = subCategoryEntity.name;
    this.picture = subCategoryEntity.picture;
    this.category = subCategoryEntity.category;
  }
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  picture: string;

  @ApiProperty({ required: false })
  category: CategoryEntity;
}
