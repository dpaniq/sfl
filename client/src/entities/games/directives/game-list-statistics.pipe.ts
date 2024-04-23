import { Pipe, PipeTransform } from '@angular/core';
import { groupBy } from 'lodash-es';
import { IGame, IPlayerStatistic } from '../types';

// TODO component with
// head emoji (2) goal emoji (1) penalty emoji (0) pass emoji (1) mvp emoji (1)
const calculateStats = (stats: IPlayerStatistic[]): number => {
  return stats.reduce((acc, stat) => {
    return acc + stat.goal + stat.goalHead * 2 + stat.penalty;
  }, 0);
};

@Pipe({
  name: 'gameListStatistics',
  standalone: true,
  pure: true,
})
export class GameListStatisticsPipe implements PipeTransform {
  transform(game: IGame): string {
    const stats = groupBy(game.statistics, 'teamId');

    const team1 = game.teams[0];
    const team2 = game.teams[1];
    // TODO change _id
    return `${team1.name.toUpperCase()} ${calculateStats(stats[team1._id])} : ${calculateStats(stats[team2._id])} ${team2.name.toUpperCase()}`;
  }
}
