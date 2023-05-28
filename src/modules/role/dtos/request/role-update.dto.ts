import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Length } from 'class-validator';

export class RoleUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(1, 45)
  name: string;

  @ApiProperty()
  @IsOptional()
  level: number;
}
