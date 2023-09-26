/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { AbstractFilterDto } from 'src/database/dtos/abstract-filter.dto';
import { DEFAULT_VALUE_FILTER } from 'src/utils/constant';

export class PostQueryDto extends AbstractFilterDto {
  @ApiProperty({ required: false, default: DEFAULT_VALUE_FILTER.SEARCH_QUERY })
  categoryId?: string = DEFAULT_VALUE_FILTER.SEARCH_QUERY;

  @ApiProperty({ required: false, default: '' })
  like?: string;
}
