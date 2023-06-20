import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  newPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  confirmNewPassword: string;
}
