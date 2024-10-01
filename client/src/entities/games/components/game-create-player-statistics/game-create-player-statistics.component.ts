import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NewGameStore } from '@entities/games/store/new-game.store';
import {
  TPlayerStatisticFinal,
  TPlayerStatisticFinalNumberKeys,
} from '@entities/games/types';
import { PlayerClient } from '@entities/players';
import { GAME_PLAYER_STATISTICS_COLUMNS } from './constants';

// There was GamePlayer
export type GamePlayerStatistic = TPlayerStatisticFinal & {
  key?: TPlayerStatisticFinalNumberKeys;
};

@Component({
  selector: 'sfl-game-create-player-statistics',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatSlideToggleModule,
  ],
  templateUrl: './game-create-player-statistics.component.html',
  styleUrl: './game-create-player-statistics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCreatePlayerStatisticsComponent {
  private readonly newGameStore = inject(NewGameStore);

  public teamId = input.required<string>();

  protected readonly columns = GAME_PLAYER_STATISTICS_COLUMNS;
  protected readonly displayedColumns = this.columns.map(c => c.columnDef);

  protected statistics = computed(() => {
    // TODO update with real one
    return this.teamId() === this.newGameStore.teams().at(0)?.id
      ? this.newGameStore.statisticsBMW()
      : this.newGameStore.statisticsHONDA();
  });

  protected readonly dataSource: Signal<
    (Pick<PlayerClient, 'nickname'> & TPlayerStatisticFinal)[]
  > = computed(() => {
    // TODO: make it litgher

    const players = this.newGameStore.players();

    if (!players.length) {
      return [];
    }

    const statisticPlayers = this.statistics().map(stat => {
      const found = players.find(player => {
        return player.id === stat.playerId;
      })!;

      // TODO START HERE

      return {
        ...stat,
        nickname: found.nickname,
      };
    });

    return statisticPlayers;
  });

  public toggleIsCaptain(playerStatistic: GamePlayerStatistic) {
    this.newGameStore.toggleIsCaptain(playerStatistic);
  }

  public toggleIsMVP(playerStatistic: GamePlayerStatistic) {
    this.newGameStore.toggleIsMVP(playerStatistic);
  }

  public toggleIsTransferable(
    playerStatistic: GamePlayerStatistic,
    isTransferable: boolean,
  ) {
    this.newGameStore.toggleTransferable({
      ...playerStatistic,
      isTransferable,
    });
  }

  public patchStatistic(
    statistic: GamePlayerStatistic,
    key: TPlayerStatisticFinalNumberKeys,
    action: 'decrement' | 'increment',
  ) {
    const number = action === 'decrement' ? -1 : 1;

    this.newGameStore.patchNumberKeysStatistics({ statistic, key, number });
  }
}
