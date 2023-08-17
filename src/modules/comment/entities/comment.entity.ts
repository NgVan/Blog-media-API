import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../../database/entities/abstract.entity';
import { PostEntity } from '../../post/entities/post.entity';
import { UserEntity } from '../../user/entities/user.entity';

export const COMMENT_TABLE = 'comment';

@Entity(COMMENT_TABLE)
export class CommentEntity extends AbstractEntity {
  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 50 })
  mentionUser: string;

  @Column({ type: 'varchar', length: 36 })
  postId: string;

  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @Column({ type: 'timestamp' })
  creationDate: Date;

  @ManyToOne(() => PostEntity, (post) => post.comments)
  @JoinColumn()
  post: PostEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn()
  user: UserEntity;
}
