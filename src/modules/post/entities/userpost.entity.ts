/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../database/entities/abstract.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { PostEntity } from './post.entity';

export const USERPOST_TABLE = 'userpost';

@Entity(USERPOST_TABLE)
export class UserPostEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @Column({ type: 'varchar', length: 36 })
  postId: string;

  @ManyToOne(() => UserEntity, (user) => user.userPosts)
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.userPosts)
  post: PostEntity;
}
