// import { UserRoleEntity } from './user-role.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { AbstractEntity } from '../../../database/entities/abstract.entity';
// import { UserOrganizationEntity } from './user-organization.entity';
// import { PositionEntity } from '../../position/entities/position.entity';
// import { ImageEntity } from '../../image/entities/image.entity';

export const ROLE_TABLE = 'role';

@Entity(ROLE_TABLE)
export class RoleEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  level: number;
}
