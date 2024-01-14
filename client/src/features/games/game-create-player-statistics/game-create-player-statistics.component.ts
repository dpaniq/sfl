import { GamePlayer } from '@entities/games/store/new-game.store';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { TeamEnum } from '@shared/constants/team';

type GamePlayerStatistic = GamePlayer;

@Component({
  selector: 'sfl-game-create-player-statistics',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './game-create-player-statistics.component.html',
  styleUrl: './game-create-player-statistics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCreatePlayerStatisticsComponent {
  @Input({ required: true }) team!: TeamEnum;
  @Input({ required: true }) dataSource!: GamePlayerStatistic[];
  @Output() readonly emitStatistic!: GamePlayerStatistic;

  columns = [
    {
      columnDef: 'nickname',
      header: 'Nickname',
      cell: (element: GamePlayerStatistic) => `${element.nickname}`,
    },
    {
      columnDef: 'pass',
      header: 'No.',
      cell: (element: GamePlayerStatistic) => `${element.pass}`,
    },
    {
      columnDef: 'goal',
      header: 'Goal',
      cell: (element: GamePlayerStatistic) => `${element.goal}`,
    },
    {
      columnDef: 'goalHead',
      header: 'Goal head',
      cell: (element: GamePlayerStatistic) => `${element.goalHead}`,
    },
    {
      columnDef: 'autoGoal',
      header: 'Autogoal',
      cell: (element: GamePlayerStatistic) => `${element.autoGoal}`,
    },
  ];
  displayedColumns = this.columns.map((c) => c.columnDef);

  ngOnChanges(changes: any) {
    // this.dataSource =
    console.log(changes);
  }
}
