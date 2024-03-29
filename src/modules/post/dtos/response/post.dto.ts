import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'src/database/dtos/abstract.dto';
import { PostEntity } from '../../entities/post.entity';
import { SubCategoryEntity } from 'src/modules/category/entities/subCategory.entity';
import { ContentEntity } from '../../entities/content.entity';
import { CommentEntity } from '../../../comment/entities/comment.entity';

export class PostDto extends AbstractDto {
  constructor(postEntity: PostEntity = <PostEntity>{}) {
    super(postEntity);
    this.title = postEntity.title;
    this.author = postEntity.author;
    this.subCategoryId = postEntity.subCategoryId;
    this.contents = postEntity.contents;
    this.comments = postEntity.comments;
  }
  @ApiProperty({ required: false })
  title: string;

  @ApiProperty({ required: false })
  author: string;

  @ApiProperty({ required: false })
  subCategoryId: string;

  @ApiProperty({ required: false })
  subCategory: SubCategoryEntity;

  @ApiProperty({ required: false })
  contents: ContentEntity[];

  @ApiProperty({ required: false })
  comments: CommentEntity[];
}
