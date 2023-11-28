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
import {Player} from './player.entity';

export enum TeamEnum {
  HONDA = 'honda',
  BMW = 'bwm',
}

@Entity()
export class Games extends BaseEntity {
  @Index()
  @Column({
    type: 'datetime',
    nullable: false,
  })
  event_day: Date;

  // @OneToMany((type) => User, (user) => user.id)

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
  asCaptain: boolean | null;

  @Column({
    type: 'boolean',
    nullable: true,
    enum: TeamEnum,
    enumName: 'TeamEnum',
  })
  team?: TeamEnum;

  @ManyToOne((type) => Player, (player) => player.id, {
    eager: false,
  })
  // To named column
  @JoinColumn({name: 'player_id'})
  player_id: number;
}
