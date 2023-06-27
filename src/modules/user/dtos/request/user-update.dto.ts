import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Length } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(1, 100)
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(1, 20)
  phoneNumber: string;
}
