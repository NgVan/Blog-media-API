import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateCatDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(1, 20)
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  picture: string;

  @ApiProperty()
  @IsOptional()
  orderNo: number;
}
