import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsNotEmpty,
  IsArray,
  NotEquals,
  IsOptional,
} from 'class-validator';

export class PostUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(1, 255)
  title: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  contents?: object[];
}
