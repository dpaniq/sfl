import { getISOWeeksInYear, isSaturday, previousSaturday } from 'date-fns';

import { totalWeeksByYear } from '@entities/utils/date';
import { GamePlayer } from './store/new-game.store';

export const totalWeeksByYear = (date: Date) => getISOWeeksInYear(date);

export const getLastSaturday = isSaturday(new Date())
  ? new Date()
  : previousSaturday(new Date());

export const isCurrentCaptain = ({
  team,
  disable,
  isCaptain,
}: GamePlayer): boolean => {
  return;
};

const totalWeeksOfYear = totalWeeksByYear(new Date());
