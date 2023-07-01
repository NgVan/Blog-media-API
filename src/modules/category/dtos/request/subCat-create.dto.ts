import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty, NotEquals } from 'class-validator';

export class SubCatCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 45)
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @NotEquals(null)
  categoryId: string;
}
