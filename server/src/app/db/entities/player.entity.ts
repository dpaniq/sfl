import {Column, Entity, JoinColumn, ManyToOne, OneToOne} from 'typeorm';
import {BaseEntity} from './base.entity';
import {User} from './user.entity';
import {BaseUUIDEntity} from './base-uuid.entity';

@Entity()
export class Player extends BaseUUIDEntity {
  @OneToOne((type) => User, (user) => user.id, {
    eager: false,
    cascade: true,
  })
  // To named column
  @JoinColumn({name: 'user_id'})
  user_id: number;

  @Column({
    nullable: true,
  })
  number?: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  isCaptain?: boolean;
}
