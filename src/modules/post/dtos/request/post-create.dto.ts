import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsNotEmpty,
  NotEquals,
  IsArray,
} from 'class-validator';

export class PostCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @NotEquals(null)
  subCategoryId: string;

  @ApiProperty()
  // @IsArray()
  @IsNotEmpty()
  contents: string; //object[];
}
