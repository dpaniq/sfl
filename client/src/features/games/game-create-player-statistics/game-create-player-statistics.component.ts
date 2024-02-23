import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { TeamEnum } from '@shared/constants/team';
import {
  NewGameStore,
  GamePlayer,
  GamePlayerStatisticKeys,
} from '@entities/games/store/new-game.store';

type GamePlayerStatistic = GamePlayer & {
  key?: GamePlayerStatisticKeys;
};

@Component({
  selector: 'sfl-game-create-player-statistics',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSlideToggleModule],
  templateUrl: './game-create-player-statistics.component.html',
  styleUrl: './game-create-player-statistics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCreatePlayerStatisticsComponent {
  readonly newGameStore = inject(NewGameStore);

  public team = input.required<TeamEnum>();
  public dataSource = input.required<GamePlayer[]>();

  columns: {
    columnDef: string;
    header: string;
    cell: (element: GamePlayerStatistic) => string;
    key?: GamePlayerStatisticKeys;
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
    {
      columnDef: 'autoGoal',
      key: 'autoGoal',
      header: 'Autogoal',
      cell: (element: GamePlayerStatistic) => `${element.autoGoal}`,
    },

    {
      columnDef: 'transferable',
      header: 'Transferable',
      cell: (element: GamePlayerStatistic) => `${element.transferable}`,
    },
  ];
  displayedColumns = this.columns.map(c => c.columnDef);
}
