import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../database/entities/abstract.entity';
import { SubCategoryEntity } from './subCategory.entity';

export const CATEGORY_TABLE = 'category';

@Entity(CATEGORY_TABLE)
export class CategoryEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(
    () => SubCategoryEntity,
    (subCategory: any) => subCategory.category,
    {
      eager: true,
      cascade: true,
    },
  )
  subCategorys: SubCategoryEntity[];
}

// Category  1 : n Subcategory
// Location  1 : n Subject
// render, netlify, cyclic
// vercel
