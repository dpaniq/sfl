import { TeamEnum } from '@shared/constants/team';

export type TPlayer = {
  id: string;

  number: number;
  avatar: number;
  isCaptain: boolean;

  nickname: string;
  name: string;
  surname: string;

  totalGames: number;
  draws: number;
  lostGames: number;
  wonGames: number;
  maxWinStreak: number;
  maxLostStreak: number;

  team?: TeamEnum;
};

export type TChosenPlayer = TPlayer & { team: TeamEnum };
