import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty } from 'class-validator';

export class UpdateCatDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 45)
  name: string;
}
