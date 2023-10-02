/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../../database/entities/abstract.entity';
import { ContentEntity } from './content.entity';
import { SubCategoryEntity } from 'src/modules/category/entities/subCategory.entity';
import { PostDto } from '../dtos/response/post.dto';
import { CommentEntity } from '../../comment/entities/comment.entity';
import { UserPostEntity } from './userpost.entity';

export const POST_TABLE = 'post';

@Entity(POST_TABLE)
export class PostEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  picture: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  like: number;

  @Column({ type: 'varchar', length: 50 })
  author: string;

  @Column({ type: 'varchar', length: 36 })
  subCategoryId: string;

  @OneToMany(
    () => ContentEntity,
    (content: any) => content.post,
    // {
    //   eager: true,
    //   cascade: true,
    // }
  )
  // @JoinColumn()
  contents: ContentEntity[];

  @OneToMany(
    () => CommentEntity,
    (comment: any) => comment.post,
    // {
    //   eager: true,
    //   cascade: true,
    // }
  )
  // @JoinColumn()
  comments: CommentEntity[];

  @OneToMany(() => UserPostEntity, (userpost: any) => userpost.post, {
    eager: true,
    cascade: true,
  })
  userPosts: UserPostEntity[];

  @ManyToOne(() => SubCategoryEntity, (subCate) => subCate.posts)
  subCategory: SubCategoryEntity;

  toDto(): PostDto {
    const dto = new PostDto(this);
    dto.contents = this.contents.sort(
      (a, b) => a.displayOrder - b.displayOrder,
    ); // Sắp xếp theo displayOrder

    dto.comments = this.comments.sort(
      (a, b) => b.created.getTime() - a.created.getTime(),
    );
    return dto;
  }
}
