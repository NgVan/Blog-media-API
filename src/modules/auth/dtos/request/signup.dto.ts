import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, IsNotEmpty } from 'class-validator';

export class SignUpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  userName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  passwordConfirm: string;
}
