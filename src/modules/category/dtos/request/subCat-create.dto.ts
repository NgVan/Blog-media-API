import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsNotEmpty,
  NotEquals,
  IsOptional,
} from 'class-validator';

export class SubCatCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  picture: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @NotEquals(null)
  categoryId: string;
}
