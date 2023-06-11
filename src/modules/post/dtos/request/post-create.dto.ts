// import { ApiProperty } from '@nestjs/swagger';
// import {
//   IsEmail,
//   IsString,
//   IsBoolean,
//   IsOptional,
//   Length,
//   IsNotEmpty,
//   IsArray,
//   ArrayMinSize,
//   Validate,
// } from 'class-validator';
// // import { CustomDuplicateRole } from './CustomDuplicateRole';

// export class PostCreateDto {
//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   @Length(1, 100)
//   firstName: string;

//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   @Length(1, 100)
//   lastName: string;

//   @ApiProperty()
//   @IsEmail()
//   emailAddress: string;

//   @ApiProperty()
//   @IsBoolean()
//   emailVerified: boolean;

//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   @Length(1, 20)
//   phoneNumber: string;

//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   @Length(1, 100)
//   password: string;

//   // @ApiProperty()
//   // @IsNotEmpty()
//   // @IsArray()
//   // @IsString({ each: true })
//   // @IsNotEmpty({ each: true })
//   // @ArrayMinSize(1)
//   // @Validate(CustomDuplicateRole, { message: 'Duplicate roleId!' })
//   // roleIds: string[];

//   // @ApiProperty()
//   // @IsOptional()
//   // @IsString()
//   // @IsNotEmpty()
//   // organizationId: string;

//   // @ApiProperty()
//   // @IsOptional()
//   // @IsString()
//   // @IsNotEmpty()
//   // positionId: string;
// }
