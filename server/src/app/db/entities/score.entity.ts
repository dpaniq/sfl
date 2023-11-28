import {Column, Entity, JoinColumn, ManyToOne, OneToOne} from 'typeorm';
import {BaseEntity} from './base.entity';
import {Player} from './player.entity';

@Entity()
export class Score extends BaseEntity {
  @OneToOne((type) => Player, (player) => player.id, {
    eager: false,
  })
  @JoinColumn({name: 'player_id'})
  player_id: number;

  @Column({})
  @Column({
    type: 'smallint',
    default: 0,
  })
  totalGames: number;

  @Column({
    type: 'smallint',
    default: 0,
  })
  draws: number;

  @Column({
    type: 'smallint',
    default: 0,
  })
  lostGames: number;

  @Column({
    type: 'smallint',
    default: 0,
  })
  wonGames: number;

  @Column({
    type: 'smallint',
    default: 0,
  })
  maxWinStreak: number;

  @Column({
    type: 'smallint',
    default: 0,
  })
  maxLostStreak: number;
}
