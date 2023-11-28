import {Column, Entity} from 'typeorm';
import {BaseEntity} from './base.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  name?: string;

  @Column({
    nullable: true,
  })
  surname?: string;

  @Column({
    nullable: true,
  })
  age?: number;

  @Column({
    nullable: true,
  })
  avatar?: string;
}
