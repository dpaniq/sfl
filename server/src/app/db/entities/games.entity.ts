import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import {User} from './user.entity';
import {BaseEntity} from './base.entity';

@Entity()
export class Games extends BaseEntity {
  @Index()
  @Column({
    type: 'datetime',
    nullable: false,
  })
  event_day: Date;

  // @OneToMany((type) => User, (user) => user.id)
  @ManyToOne((type) => User, (user) => user.id, {
    eager: false,
    onDelete: 'CASCADE',
  })
  // To named column
  @JoinColumn({name: 'player_id'})
  player_id: number;

  @Column({
    type: 'int2',
    nullable: true,
  })
  goals: number | null;

  @Column({
    type: 'int2',
    nullable: true,
  })
  head_goals: number | null;

  @Column({
    type: 'int2',
    nullable: true,
  })
  passes: number | null;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  mvp: boolean | null;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  capitan: boolean | null;
}