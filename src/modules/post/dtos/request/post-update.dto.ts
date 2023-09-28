import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsOptional, IsNotEmpty } from 'class-validator';

export class PostUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(1, 255)
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  picture: string;

  @ApiProperty()
  @IsNotEmpty()
  contents: string;
}
