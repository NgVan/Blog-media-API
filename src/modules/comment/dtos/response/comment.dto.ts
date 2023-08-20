import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'src/database/dtos/abstract.dto';
import { CommentEntity } from '../../entities/comment.entity';
// import { UserEntity } from '../../../user/entities/user.entity';

export class CommentDto extends AbstractDto {
  constructor(commentEntity: CommentEntity = <CommentEntity>{}) {
    super(commentEntity);
    this.content = commentEntity.content;
    this.mentionUser = commentEntity.mentionUser;
    this.userId = commentEntity.userId;
    this.postId = commentEntity.postId;
    // this.user = commentEntity.user;
  }
  @ApiProperty({ required: false })
  content: string;

  @ApiProperty({ required: false })
  mentionUser: string;

  @ApiProperty({ required: false })
  userId: string;

  @ApiProperty({ required: false })
  postId: string;

  // @ApiProperty({ required: false })
  // user: UserEntity;
}
