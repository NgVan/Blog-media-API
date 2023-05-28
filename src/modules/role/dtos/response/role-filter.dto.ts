import { ApiProperty } from '@nestjs/swagger';
import { DTO_DEFAULT_VALUE } from '../../../../utils/constant';
import { RoleDto } from './role.dto';

export class RoleFilterDto {
  @ApiProperty({ type: [RoleDto], required: false })
  entities: RoleDto[];

  @ApiProperty({ required: false, default: DTO_DEFAULT_VALUE })
  totalEntities: number;
}
