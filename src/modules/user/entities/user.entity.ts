// import { UserRoleEntity } from './user-role.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { AbstractEntity } from '../../../database/entities/abstract.entity';
import { AuthEntity } from 'src/modules/auth/entities/auth.entity';
// import { UserOrganizationEntity } from './user-organization.entity';
// import { PositionEntity } from '../../position/entities/position.entity';
// import { ImageEntity } from '../../image/entities/image.entity';

export const USER_TABLE = 'user';

@Entity(USER_TABLE)
export class UserEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 100 })
  fullName: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  emailAddress: string;

  @Column({ type: 'boolean' })
  emailVerified: boolean;

  @Column({ type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  // @OneToOne(() => AuthEntity, (auth) => auth.user) // specify inverse side as a second parameter
  // auth: AuthEntity;
}
