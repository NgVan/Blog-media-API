import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface IAbstractEntity {
  id?: string;
  created: Date;
  modified?: Date;
}
export abstract class AbstractEntity
  extends BaseEntity
  implements IAbstractEntity
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    update: false,
    insert: true,
    select: true,
    type: 'timestamp',
  })
  created: Date;

  @UpdateDateColumn({
    update: true,
    insert: true,
    select: true,
    nullable: true,
    type: 'timestamp',
  })
  modified: Date;

  @DeleteDateColumn({
    update: true,
    insert: true,
    select: true,
    nullable: true,
    type: 'timestamp',
  })
  deleted?: Date;
}
