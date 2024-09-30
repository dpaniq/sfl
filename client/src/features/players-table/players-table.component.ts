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
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CaptainsService } from '@entities/captains';
import { PlayerClient, PlayersStore } from '@entities/players';
import { PlayerEditDialogComponent } from '@entities/players/components/player-edit-dialog/player-edit-dialog.component';
import { AuthService } from '@shared/services/auth.service';

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
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
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
  private dialog = inject(MatDialog);

  private playersStore = inject(PlayersStore);
  private authService = inject(AuthService);

  public user = this.authService.user();

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

  readonly dataSource = new MatTableDataSource<PlayerClient>([]);
  readonly displayedColumns: (
    | keyof PlayerClient
    | 'actions'
    | 'name'
    | 'surname'
  )[] = [
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

  editPlayer(player: PlayerClient) {
    this.dialog
      .open(PlayerEditDialogComponent, {
        data: player,
      })
      .afterClosed()
      .subscribe(result => {
        console.log('The dialog was closed', result);
      });
  }
}
