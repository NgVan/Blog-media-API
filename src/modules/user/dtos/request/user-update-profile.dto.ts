/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Length } from 'class-validator';

export class UserUpdateProfileDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(1, 100)
  displayName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(1, 20)
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  picture: string;
}
