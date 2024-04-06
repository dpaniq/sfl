import { totalWeeksByYear } from '@entities/utils/date';

export const TOTAL_GAMES_OF_YEAR = totalWeeksByYear(new Date());

export enum EnumGameStatus {
  Furture = 'furture',
  New = 'new',
  Draft = 'draft',
  Published = 'published',
}

export enum EnumGameMode {
  Init = 'init',
  Create = 'create',
  Edit = 'edit',
  Unknown = 'unknown',
}
