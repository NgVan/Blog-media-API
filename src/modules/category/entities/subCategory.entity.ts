import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../database/entities/abstract.entity';
import { CategoryEntity } from './category.entity';

export const SUBCATEGORY_TABLE = 'subcategory';

@Entity(SUBCATEGORY_TABLE)
export class SubCategoryEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', length: 36 })
  categoryId: string;

  @ManyToOne(() => CategoryEntity, (category) => category.subCategories)
  category: CategoryEntity;
}
