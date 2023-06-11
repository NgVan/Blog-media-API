// import { ApiProperty } from '@nestjs/swagger';
// // import { OrganizationDto } from '../../../organization/dtos/response/organization.dto';
// // import { RoleDto } from '../../../role/dtos/response/role.dto';
// import { AbstractDto } from '../../../../database/dtos/abstract.dto';
// import { UserEntity } from '../../entities/user.entity';
// // import { PositionEntity } from '../../../position/entities/position.entity';
// // import { ImageEntity } from '../../../image/entities/image.entity';

// export class UserDto extends AbstractDto {
//   constructor(userEntity: UserEntity = <UserEntity>{}) {
//     super(userEntity);
//     this.firstName = userEntity?.firstName;
//     this.lastName = userEntity?.lastName;
//     this.emailAddress = userEntity?.emailAddress;
//     this.emailVerified = userEntity?.emailVerified;
//     this.phoneNumber = userEntity?.phoneNumber;
//   }

//   @ApiProperty({ required: false })
//   firstName: string;

//   @ApiProperty({ required: false })
//   lastName: string;

//   @ApiProperty({ required: false })
//   emailAddress: string;

//   @ApiProperty({ required: false })
//   emailVerified: boolean;

//   @ApiProperty({ required: false })
//   phoneNumber: string;
// }
