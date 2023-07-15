import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Length, IsArray } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(1, 100)
  userName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(1, 20)
  phoneNumber: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  permissions: string[];
}
