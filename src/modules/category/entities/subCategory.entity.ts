import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../database/entities/abstract.entity';
import { CategoryEntity } from './category.entity';
import { PostEntity } from 'src/modules/post/entities/post.entity';

export const SUBCATEGORY_TABLE = 'subcategory';

@Entity(SUBCATEGORY_TABLE)
export class SubCategoryEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', length: 36 })
  categoryId: string;

  @ManyToOne(() => CategoryEntity, (category) => category.subCategories)
  category: CategoryEntity;

  @OneToMany(() => PostEntity, (post: any) => post.subCategory, {
    eager: true,
    cascade: true,
  })
  posts: PostEntity[];
}
