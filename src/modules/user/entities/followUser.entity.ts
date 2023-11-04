// import { UserRoleEntity } from './user-role.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../database/entities/abstract.entity';
import { UserEntity } from './user.entity';

export const FOLLOW_USER_TABLE = 'userfollow';

@Entity(FOLLOW_USER_TABLE)
export class FollowUserEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 36 })
  followerId: string;

  @Column({ type: 'varchar', length: 36 })
  trackedUserId: string;

  @ManyToOne(() => UserEntity, (user) => user.followerArs)
  follower: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.trackedArs)
  trackedUser: UserEntity;
}
