import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class SubCatUpdateDto {
  @ApiProperty()
  @IsString()
  @Length(1, 20)
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  picture: string;
}
