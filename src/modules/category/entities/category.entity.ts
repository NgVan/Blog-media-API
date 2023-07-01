import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../database/entities/abstract.entity';
import { SubCategoryEntity } from 'src/modules/category/entities/subcategory.entity';

export const CATEGORY_TABLE = 'category';

@Entity(CATEGORY_TABLE)
export class CategoryEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => SubCategoryEntity, (subCategory) => subCategory.category, {
    eager: true,
    cascade: true,
  })
  subCategorys: SubCategoryEntity[];
}

// Category  1 : n Subcategory
// Location  1 : n Subject
