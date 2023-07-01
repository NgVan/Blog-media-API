/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { DTO_DEFAULT_VALUE } from 'src/utils/constant';
import { SubCategoryDto } from './subCat.dto';

export class SubCatFilterDto {
  @ApiProperty({ type: [SubCategoryDto], required: false })
  entities: SubCategoryDto[];

  @ApiProperty({ required: false, default: DTO_DEFAULT_VALUE })
  totalEntities: number;
}
