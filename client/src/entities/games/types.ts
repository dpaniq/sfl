import { EnumGameStatus } from './constants';

export interface IPlayerStatistic {
  playerId: string;
  teamId: string;
  goal?: number;
  goalHead?: number;
  autoGoal?: number;
  penalty?: number;
  mvp?: boolean;

  // More details
  // distance?: number;
  // position?: IPlayerPosition;
  // injure?: boolean;
  // pulse?: number;
}

export interface IGame {
  _id?: string;
  season: number;
  number: number;
  playedAt: Date;
  status: EnumGameStatus;
  statistics: IPlayerStatistic[];
}

export type TGameCard = Omit<IGame, 'statistics'>;
