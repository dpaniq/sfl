import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { GameListStatisticsPipe, GameStore, IGame } from '@entities/games';

@Component({
  selector: 'sfl-games-table',
  standalone: true,
  templateUrl: './games-table.component.html',
  styleUrls: ['./games-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatSortModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    GameListStatisticsPipe,
  ],
  providers: [],
})
export class GamesTableComponent implements OnDestroy, AfterViewInit {
  readonly gameStore = inject(GameStore);

  readonly loadingSingal = this.gameStore.loading;

  readonly gamesEffectRef = effect(() => {
    this.dataSource.data = this.gameStore.games();
  });

  constructor(private _destroyRef: DestroyRef) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngOnDestroy() {
    this.gamesEffectRef.destroy();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  readonly dataSource = new MatTableDataSource<IGame>([]);
  readonly displayedColumns: (keyof IGame | 'result')[] = [
    'season',
    'number',
    'status',
    'result',
    'playedAt',
  ];
}
