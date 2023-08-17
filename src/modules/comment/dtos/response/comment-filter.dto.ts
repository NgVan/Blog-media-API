import { ApiProperty } from '@nestjs/swagger';
import { DTO_DEFAULT_VALUE } from 'src/utils/constant';
import { CommentDto } from './comment.dto';

export class CommentFilterDto {
  @ApiProperty({ type: [CommentDto], required: false })
  entities: CommentDto[];

  @ApiProperty({ required: false, default: DTO_DEFAULT_VALUE })
  totalEntities: number;
}
