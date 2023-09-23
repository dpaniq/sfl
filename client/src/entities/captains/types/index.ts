export type TCaptain = {
  id: string;
  avatar: number;

  number: number;
  nickname: string;
  name: string;
  surname: string;

  captain: boolean;
  totalGames: number;
  draws: number;
  lostGames: number;
  wonGames: number;
  maxWinStreak: number;
  maxLostStreak: number;
  team?: string;
};

export type TChosenCaptain = TCaptain & { team: string };