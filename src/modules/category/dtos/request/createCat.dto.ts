import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateCatDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  picture: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isAlbum: boolean;
}
