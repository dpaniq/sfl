// TODO X imports - isolate

import { EnumTeamColor } from '@entities/teams/constants';
import { EnumGameStatus } from './constants';

// Game
export interface IGameSettings {}
export interface IGameDTO {
  id: string;
  number: number;
  season: number;
  playedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  teams: ITeamDTO[];
  status: EnumGameStatus;
  statistics: IPlayerStatisticDTO[];
}

export type TGameFinal = SetOptional<IGameDTO, 'id'> & IGameSettings;

export type TGameFinalWithoutStatistics = Omit<TGameFinal, 'statistics'>;

// Team
export interface ITeamSettings {}
export interface ITeamDTO {
  id: string;
  name: string;
  color: EnumTeamColor;
  description?: string;
  logo?: string | null;
}
export type TTeamFinal = ITeamDTO & ITeamSettings;

// Players
export interface IPlayerSettings {}
export interface IPlayerDTO {
  id: string;
  number?: number;
  avatar?: string;
  isCaptain: boolean;
  nickname: string;

  user: {
    id: string;
    email: string;
    name?: string;
    surname?: string;
    avatar?: string;
  };
}
export type TPlayerFinal = IPlayerDTO & IPlayerSettings;

// Statistic
export interface IPlayerStatisticSettings {
  id: string;
  playerData: TPlayerFinal;
}

export interface IPlayerStatisticDTO {
  playerId: string;
  teamId: string;

  goal: number;
  goalHead: number;
  autoGoal: number;
  penalty: number;
  pass: number;

  isMVP: boolean;
  isCaptain: boolean;
  isTransferable: boolean;
  // More details
  // distance?: number;
  // position?: IPlayerPosition;
  // injure?: boolean;
  // pulse?: number;
}

export type TPlayerStatisticFinal = IPlayerStatisticDTO &
  IPlayerStatisticSettings;
export type TPlayerStatisticFinalIds = Pick<
  TPlayerStatisticFinal,
  'playerId' | 'teamId'
>;
export type TPlayerStatisticFinalNumber = Pick<
  TPlayerStatisticFinal,
  'pass' | 'goal' | 'goalHead' | 'autoGoal' | 'penalty'
>;
export type TPlayerStatisticFinalNumberKeys = keyof TPlayerStatisticFinalNumber;

export type TPlayerStatisticFinalBoolean = Pick<
  TPlayerStatisticFinal,
  'isMVP' | 'isCaptain' | 'isTransferable'
>;
export type TPlayerStatisticFinalBooleanKeys =
  keyof TPlayerStatisticFinalBoolean;
export type TGamePlayerStatisticFinal = TPlayerStatisticFinalBoolean &
  TPlayerStatisticFinalNumber &
  Partial<TPlayerStatisticFinalIds> &
  Partial<IPlayerStatisticSettings>;
