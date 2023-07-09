import { ApiProperty } from '@nestjs/swagger';
import { DTO_DEFAULT_VALUE } from 'src/utils/constant';
import { PostDto } from './post.dto';

export class PostFilterDto {
  @ApiProperty({ type: [PostDto], required: false })
  entities: PostDto[];

  @ApiProperty({ required: false, default: DTO_DEFAULT_VALUE })
  totalEntities: number;
}
