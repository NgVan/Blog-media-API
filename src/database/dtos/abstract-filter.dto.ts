import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { DEFAULT_VALUE_FILTER } from '../../utils/constant';

export class AbstractFilterDto {
  @ApiProperty({
    required: false,
    default: DEFAULT_VALUE_FILTER.PAGE,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  page?: number = DEFAULT_VALUE_FILTER.PAGE;

  @ApiProperty({
    required: false,
    default: DEFAULT_VALUE_FILTER.LIMIT,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  limit?: number = DEFAULT_VALUE_FILTER.LIMIT;

  @ApiProperty({ required: false, default: DEFAULT_VALUE_FILTER.WITH_DELETED })
  @IsOptional()
  withDeleted?: boolean = DEFAULT_VALUE_FILTER.WITH_DELETED;
}
