import { ApiProperty } from '@nestjs/swagger';
import { DEFAULT_VALUE_FILTER } from '../../../../utils/constant';
import { AbstractFilterDto } from '../../../../database/dtos/abstract-filter.dto';

export class RoleQueryDto extends AbstractFilterDto {
  @ApiProperty({ required: false, default: DEFAULT_VALUE_FILTER.SEARCH_QUERY })
  searchQuery?: string = DEFAULT_VALUE_FILTER.SEARCH_QUERY;
}
