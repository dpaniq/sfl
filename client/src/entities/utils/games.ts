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

  // To make inclusive +1 week
  const weeksInclusive =
    Math.abs(differenceInWeeks(startOfSeason, endOfSeason)) + 1;

  console.log(weeks, weeksInclusive);

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
  for (const gameIdx of Array(weeksInclusive).keys()) {
    lastSaturday = nextSaturday(lastSaturday);

    gameCards.push({
      season: year,
      gameIdx: gameIdx + 1,
      gameDate: lastSaturday,
    });
  }

  return gameCards;
};
