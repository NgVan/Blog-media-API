import { ApiProperty } from '@nestjs/swagger';
import { DTO_DEFAULT_VALUE } from '../../../../utils/constant';
import { UserDto } from './user.dto';

export class UserFilterDto {
  @ApiProperty({ type: [UserDto], required: false })
  entities: UserDto[];

  @ApiProperty({ required: false, default: DTO_DEFAULT_VALUE })
  totalEntities: number;
}
