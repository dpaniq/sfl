import {Column, Entity, OneToMany} from 'typeorm';
import {User} from './user.entity';
import {BaseEntity} from './base.entity';

@Entity()
export class Token extends BaseEntity {
  @OneToMany((type) => User, (user) => user.id)
  userId: string;

  @Column()
  refreshToken: string;
}
