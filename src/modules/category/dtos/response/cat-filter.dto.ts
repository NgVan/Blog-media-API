/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from './cat.dto';
import { DTO_DEFAULT_VALUE } from 'src/utils/constant';

export class CatFilterDto {
  @ApiProperty({ type: [CategoryDto], required: false })
  entities: CategoryDto[];

  @ApiProperty({ required: false, default: DTO_DEFAULT_VALUE })
  totalEntities: number;
}
