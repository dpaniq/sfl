import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  GamePlayer,
  NewGameStore,
  PlayerStatisticNumberKeys,
} from '@entities/games/store/new-game.store';
import { IPlayerStatistic } from '@entities/games/types';
import { TPlayer } from '@entities/players';
import { ITeam } from '@entities/teams';

type GamePlayerStatistic = GamePlayer &
  IPlayerStatistic & {
    key?: PlayerStatisticNumberKeys;
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
  readonly newGameStore = inject(NewGameStore);

  public team = input.required<ITeam>();
  public dataSource =
    input.required<(Pick<TPlayer, 'nickname'> & IPlayerStatistic)[]>();

  columns: {
    columnDef: string;
    header: string;
    cell: (element: GamePlayerStatistic) => string;
    key?: PlayerStatisticNumberKeys;
  }[] = [
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
      cell: (element: GamePlayerStatistic) => `${element.mvp}`,
    },
    {
      columnDef: 'transferable',
      header: '<->',
      cell: (element: GamePlayerStatistic) => `${element.transferable}`,
    },
  ];
  displayedColumns = this.columns.map(c => c.columnDef);
}
