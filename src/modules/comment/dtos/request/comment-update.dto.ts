import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CommentUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  mentionUser: string;
}
