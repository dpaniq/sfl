import { ITeam } from '@entities/teams';
import { EnumGameStatus } from './constants';

export interface IPlayerStatistic {
  playerId: string;
  teamId: string;
  goal: number;
  goalHead: number;
  autoGoal: number;
  penalty: number;
  pass: number;
  mvp?: boolean;

  isCaptain: boolean;

  // More details
  // distance?: number;
  // position?: IPlayerPosition;
  // injure?: boolean;
  // pulse?: number;
}

export interface IGame {
  id?: string;
  season: number;
  number: number;
  playedAt: Date;
  teams: Record<string, ITeam>;
  status: EnumGameStatus;
  statistics: IPlayerStatistic[];
}

export type TGameCard = Omit<IGame, 'statistics'>;
