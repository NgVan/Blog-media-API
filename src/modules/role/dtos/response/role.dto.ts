import { ApiProperty } from '@nestjs/swagger';
// import { OrganizationDto } from '../../../organization/dtos/response/organization.dto';
// import { RoleDto } from '../../../role/dtos/response/role.dto';
import { AbstractDto } from '../../../../database/dtos/abstract.dto';
import { RoleEntity } from '../../entities/role.entity';
// import { PositionEntity } from '../../../position/entities/position.entity';
// import { ImageEntity } from '../../../image/entities/image.entity';

export class RoleDto extends AbstractDto {
  constructor(roleEntity: RoleEntity = <RoleEntity>{}) {
    super(roleEntity);
    this.name = roleEntity?.name;
    this.level = roleEntity?.level;
  }

  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  level: number;
}
