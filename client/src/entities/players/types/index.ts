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
};

export type TChosenPlayer = Required<TPlayer> & { team: TeamEnum | null };

type MakeOptional<T, Keys extends keyof T> = Omit<T, Keys> &
  Partial<Pick<T, Keys>>;
