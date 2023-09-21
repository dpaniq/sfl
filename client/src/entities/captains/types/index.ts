export type TCaptain = {
  id: string;
  number: number;
  avatar: number;
  captain: boolean;
  nickname: string;
  name: string;
  surname: string;
  totalGames: number;
  draws: number;
  lostGames: number;
  wonGames: number;
  maxWinStreak: number;
  maxLostStreak: number;
  team?: string;
};

export type TChosenCaptain = TCaptain & { team: string };
