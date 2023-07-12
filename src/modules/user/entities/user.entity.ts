// import { UserRoleEntity } from './user-role.entity';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../database/entities/abstract.entity';

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

  @Column({ type: 'text' })
  picture: string;

  // @OneToOne(() => AuthEntity, (auth) => auth.user) // specify inverse side as a second parameter
  // auth: AuthEntity;
}
