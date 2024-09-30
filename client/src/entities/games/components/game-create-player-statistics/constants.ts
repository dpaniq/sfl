import { TPlayerStatisticFinalNumberKeys } from '@entities/games/types';
import { GamePlayerStatistic } from './game-create-player-statistics.component';

export type StatisticColumn = {
  columnDef: string;
  header: string;
  cell: (element: GamePlayerStatistic) => string;
  key?: TPlayerStatisticFinalNumberKeys;
};

export const GAME_PLAYER_STATISTICS_COLUMNS: StatisticColumn[] = [
  {
    columnDef: 'isCaptain',
    header: 'C',
    cell: (element: GamePlayerStatistic) => `${element.isCaptain}`,
  },
  {
    columnDef: 'nickname',
    header: 'Nickname',
    cell: (element: GamePlayerStatistic) => `${element.nickname}`,
  },
  {
    columnDef: 'pass',
    key: 'pass',
    header: 'Passes',
    cell: (element: GamePlayerStatistic) => `${element.pass}`,
  },
  {
    columnDef: 'goal',
    key: 'goal',
    header: 'Goal',
    cell: (element: GamePlayerStatistic) => `${element.goal}`,
  },
  {
    columnDef: 'goalHead',
    key: 'goalHead',
    header: 'Goal head',
    cell: (element: GamePlayerStatistic) => `${element.goalHead}`,
  },
  // {
  //   columnDef: 'autoGoal',
  //   key: 'autoGoal',
  //   header: 'Autogoal',
  //   cell: (element: GamePlayerStatistic) => `${element.autoGoal}`,
  // },
  {
    columnDef: 'penalty',
    key: 'penalty',
    header: 'Penalty',
    cell: (element: GamePlayerStatistic) => `${element.penalty}`,
  },
  {
    columnDef: 'mvp',
    header: 'MVP',
    cell: (element: GamePlayerStatistic) => `${element.isMVP}`,
  },

  {
    columnDef: 'transferable',
    header: '<->',
    cell: (element: GamePlayerStatistic) => `${element.isTransferable}`,
  },
];
