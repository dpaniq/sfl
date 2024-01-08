import { getISOWeeksInYear, isSaturday, previousSaturday } from 'date-fns';

export const totalWeeksByYear = (date: Date) => getISOWeeksInYear(date);

export const getLastSaturday = isSaturday(new Date())
  ? new Date()
  : previousSaturday(new Date());
