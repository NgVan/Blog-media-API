import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional } from 'class-validator';

export class CommentCreateDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  postId: string;

  @ApiProperty()
  // @IsDate()
  creationDate: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  mentionUser: string;
}
