import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'src/database/dtos/abstract.dto';
import { CommentEntity } from '../../entities/comment.entity';

export class CommentDto extends AbstractDto {
  constructor(commentEntity: CommentEntity = <CommentEntity>{}) {
    super(commentEntity);
    this.content = commentEntity.content;
    this.creationDate = commentEntity.creationDate;
    this.mentionUser = commentEntity.mentionUser;
    this.userId = commentEntity.userId;
    this.postId = commentEntity.postId;
  }
  @ApiProperty({ required: false })
  content: string;

  @ApiProperty({ required: false })
  creationDate: Date;

  @ApiProperty({ required: false })
  mentionUser: string;

  @ApiProperty({ required: false })
  userId: string;

  @ApiProperty({ required: false })
  postId: string;
}
