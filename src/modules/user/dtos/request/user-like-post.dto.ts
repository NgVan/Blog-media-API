/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LikePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postId: string;
}
