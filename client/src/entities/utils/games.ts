import { TGameFinalWithoutStatistics } from '@entities/games/types';
import {
  addYears,
  differenceInWeeks,
  eachWeekOfInterval,
  nextSaturday,
  startOfMonth,
} from 'date-fns';

// const third = 3;
const SATURDAY = 6;

export const getGameCards = (year: number): TGameFinalWithoutStatistics[] => {
  const gameCards: TGameFinalWithoutStatistics[] = [];
  const startOfSeason = startOfMonth(new Date(`${year}-12-01`));

  console.log({ startOfSeason });

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

    // gameCards.push({
    //   status: EnumGameStatus.Draft,
    //   season: year,
    //   number: gameIdx + 1,
    //   playedAt: lastSaturday,
    // });
  }

  return gameCards;
};
