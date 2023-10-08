import { ApiProperty } from '@nestjs/swagger';
// import { OrganizationDto } from '../../../organization/dtos/response/organization.dto';
// import { RoleDto } from '../../../role/dtos/response/role.dto';
import { AbstractDto } from '../../../../database/dtos/abstract.dto';
import { UserEntity } from '../../entities/user.entity';
// import { PositionEntity } from '../../../position/entities/position.entity';
// import { ImageEntity } from '../../../image/entities/image.entity';

export class UserDto extends AbstractDto {
  constructor(userEntity: UserEntity = <UserEntity>{}) {
    super(userEntity);
    this.userName = userEntity?.userName;
    this.displayName = userEntity?.displayName;
    this.emailAddress = userEntity?.emailAddress;
    // this.emailVerified = userEntity?.emailVerified;
    this.phoneNumber = userEntity?.phoneNumber;
    this.picture = userEntity?.picture;
    this.role = userEntity?.role;
    this.permissions = userEntity?.permission
      ? userEntity.permission.split('-')
      : [];
  }

  @ApiProperty({ required: false })
  userName: string;

  @ApiProperty({ required: false })
  displayName: string;

  @ApiProperty({ required: false })
  emailAddress: string;

  // @ApiProperty({ required: false })
  // emailVerified: boolean;

  @ApiProperty({ required: false })
  phoneNumber: string;

  @ApiProperty({ required: false })
  picture: string;

  @ApiProperty({ required: false })
  role: string;

  @ApiProperty({ required: false })
  permissions: string[];
}
