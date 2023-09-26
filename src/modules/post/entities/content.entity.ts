/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../database/entities/abstract.entity';
import { PostEntity } from './post.entity';

export const CONTENT_TABLE = 'content';

@Entity(CONTENT_TABLE)
export class ContentEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 25 })
  type: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'int' })
  displayOrder: number;

  @Column({ type: 'varchar', length: 36 })
  postId: string;

  @ManyToOne(() => PostEntity, (post) => post.contents, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  post: PostEntity;
}
