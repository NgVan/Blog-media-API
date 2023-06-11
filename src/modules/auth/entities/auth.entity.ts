import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { AbstractEntity } from '../../../database/entities/abstract.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export const AUTH_TABLE = 'auth';

@Entity(AUTH_TABLE)
export class AuthEntity extends AbstractEntity {
  @Column({ type: 'text' })
  accessToken: string;

  @Column({ type: 'text' })
  refreshToken: string;

  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @OneToOne(() => UserEntity, { eager: true, cascade: true })
  @JoinColumn()
  user: UserEntity;
}
