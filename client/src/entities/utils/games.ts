import { GameCard } from '@entities/games/types';
import { forEach } from 'lodash';
import { getLastSaturday } from './date';
import {
  eachWeekOfInterval,
  getYear,
  startOfYear,
  endOfYear,
  startOfISOWeekYear,
  endOfISOWeekYear,
  addYears,
  setDay,
  getDay,
  startOfMonth,
  getISOWeeksInYear,
  nextSaturday,
  format,
  differenceInWeeks,
} from 'date-fns';

// const third = 3;
const SATURDAY = 6;

export const getGameCards = (year: number): GameCard[] => {
  const gameCards: GameCard[] = [];
  const startOfSeason = startOfMonth(new Date(`${year}-12-01`));
  const endOfSeason = addYears(startOfSeason, 1);

  const weeks = eachWeekOfInterval({
    start: startOfSeason,
    end: endOfSeason,
  }).length;

  const weeks2 = differenceInWeeks(startOfSeason, endOfSeason);

  console.log(weeks, weeks2);

  // for ()

  // Filter out the Saturdays
  // const saturdays = weeks.filter(week => format(week, 'EEEE') === 'Saturday');

  // // Output the Saturdays
  // saturdays.forEach((saturday, index) => {
  //   gameCards.push({
  //     gameIdx: index + 1,
  //     gameDate: saturday,
  //   });
  // });
  // return gameCards;

  // return [];

  // const weeks = getISOWeeksInYear(startOfSeason);

  let lastSaturday = startOfSeason;
  for (const gameIdx of Array(weeks).keys()) {
    lastSaturday = nextSaturday(lastSaturday);

    gameCards.push({
      gameIdx: gameIdx + 1,
      gameDate: lastSaturday,
    });
  }

  return gameCards;

  // const firstSaturday = setDay(startOfSeason, SATURDAY, {
  //   weekStartsOn: SATURDAY,
  // });

  // const endOfSeason = addYears(startOfSeason, 1);

  // const weekDates = eachWeekOfInterval({
  //   start: startOfSeason,
  //   end: endOfSeason,
  // });

  // return weekDates.map((weekDate, gameIdx) => {
  //   // const gameDate = getLastSaturday(weekDate);
  //   return {
  //     gameIdx: gameIdx + 1,
  //     gameDate: weekDate,
  //   };
  // });
};
