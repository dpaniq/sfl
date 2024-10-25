import { TeamEnum } from '@shared/constants/team';

export interface PlayerBaseClient {
  id: string;
  number: number;
  avatar: string;
  isCaptain: boolean;
  nickname: string;
}

export interface PlayerStatsClient {
  totalGames: number;
  draws: number;
  lostGames: number;
  wonGames: number;
  maxWinStreak: number;
  maxLostStreak: number;
}

export type PlayerClient = PlayerBaseClient & PlayerStatsClient;
export type PlayerWithUserClient = PlayerClient & {
  user: {
    id: string;
    name: string;
    surname: string;
    email: string;
  };
};

// @deprecated
export type TChosenPlayer = Required<PlayerClient> & { team: TeamEnum | null };
