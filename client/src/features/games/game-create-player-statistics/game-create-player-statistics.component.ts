import {
  GamePlayer,
  GamePlayerStatisticKeys,
  NewGameStore,
} from '@entities/games/store/new-game.store';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { TeamEnum } from '@shared/constants/team';

type GamePlayerStatistic = GamePlayer & {
  key?: GamePlayerStatisticKeys;
};

@Component({
  selector: 'sfl-game-create-player-statistics',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './game-create-player-statistics.component.html',
  styleUrl: './game-create-player-statistics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCreatePlayerStatisticsComponent {
  #newGameStore = inject(NewGameStore);

  @Input({ required: true }) team!: TeamEnum;
  @Input({ required: true }) dataSource: GamePlayerStatistic[] = [];
  @Output() readonly emitStatistic!: GamePlayerStatistic;

  patchPlayerStatistic = this.#newGameStore.patchPlayerStatistic;

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
  ];
  displayedColumns = this.columns.map((c) => c.columnDef);
}
