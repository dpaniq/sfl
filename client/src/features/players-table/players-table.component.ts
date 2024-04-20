import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CaptainsService } from '@entities/captains';
import { PlayersStore, TPlayer } from '@entities/players';

@Component({
  selector: 'sfl-players-table',
  standalone: true,
  templateUrl: './players-table.component.html',
  styleUrls: ['./players-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [
    // Fixme: CaptainsStore uses CaptainsService, idk how to fix this
    // https://angular.io/api/core/FactoryProvider
    CaptainsService,

    // To use CaptainsService - useEffects
    // provideComponentStore(PlayersStore),
  ],
})
export class PlayersTableComponent implements OnInit, OnDestroy, AfterViewInit {
  private playersStore = inject(PlayersStore);

  playersEffectRef = effect(() => {
    this.dataSource.data = this.playersStore.players();
  });

  constructor(private _destroyRef: DestroyRef) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngOnDestroy() {
    this.playersEffectRef.destroy();
  }

  ngOnInit() {
    // Comment
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  readonly dataSource = new MatTableDataSource<TPlayer>([]);
  readonly displayedColumns: (keyof TPlayer | 'actions')[] = [
    'avatar',
    'number',
    'name',
    'surname',
    'nickname',
    'isCaptain',

    'totalGames',
    'wonGames',
    'lostGames',
    'draws',

    'maxWinStreak',
    'maxLostStreak',

    'actions',

    // TBC
    // playsForA: number
    // playsForB: number

    // season[number]: + / - points
    // season[number]: + / - points
    // season[number]: + / - points
  ];
}
