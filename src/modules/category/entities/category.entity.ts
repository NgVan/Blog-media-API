import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../database/entities/abstract.entity';
import { SubCategoryEntity } from './subCategory.entity';

export const CATEGORY_TABLE = 'category';

@Entity(CATEGORY_TABLE)
export class CategoryEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  picture: string;

  @Column({ type: 'boolean' })
  isAlbum: boolean;

  @Column({ type: 'int' })
  orderNo: number;

  @OneToMany(
    () => SubCategoryEntity,
    (subCategory: any) => subCategory.category,
    {
      eager: true,
      cascade: true,
    },
  )
  subCategories: SubCategoryEntity[];
}

// Category  1 : n Subcategory
// Post      1 : n Content
// Sub-cate  1 : n Post
// Location  1 : n Subject
// render, netlify, cyclic
// vercel
