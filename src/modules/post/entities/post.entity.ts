// // import { UserRoleEntity } from './user-role.entity';
// import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
// import { AbstractEntity } from '../../../database/entities/abstract.entity';
// // import { UserOrganizationEntity } from './user-organization.entity';
// // import { PositionEntity } from '../../position/entities/position.entity';
// // import { ImageEntity } from '../../image/entities/image.entity';

// export const USER_TABLE = 'post';

// @Entity(USER_TABLE)
// export class PostEntity extends AbstractEntity {
//   @Column({ type: 'varchar', length: 50 })
//   firstName: string;

//   @Column({ type: 'varchar', length: 50 })
//   lastName: string;

//   @Column({ type: 'varchar', length: 100, unique: true })
//   emailAddress: string;

//   @Column({ type: 'boolean' })
//   emailVerified: boolean;

//   @Column({ type: 'varchar', length: 20 })
//   phoneNumber: string;

//   @Column({ type: 'varchar', length: 100 })
//   password: string;
// }
