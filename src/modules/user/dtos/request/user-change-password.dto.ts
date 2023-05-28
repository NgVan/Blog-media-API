import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserChangePasswordDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEmail()
  emailAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  newPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  newPasswordConfirm: string;
}
