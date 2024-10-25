import { getISOWeeksInYear, isSaturday, previousSaturday } from 'date-fns';
import { TPlayerStatisticFinal } from './types';

export const totalWeeksByYear = (date: Date) => getISOWeeksInYear(date);

export const getLastSaturday = isSaturday(new Date())
  ? new Date()
  : previousSaturday(new Date());

export function isPlayerStatisticTransferable(
  id: string,
  players: TPlayerStatisticFinal[],
) {
  return players.filter(player => player.playerId === id).length == 2;
}
