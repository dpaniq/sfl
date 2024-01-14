import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlayersStore, TPlayer } from '@entities/players';

@Component({
  selector: 'sfl-players-toggle',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: './players-toggle.component.html',
  styleUrls: ['./players-toggle.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersToggleComponent {
  constructor(
    private _destroyRef: DestroyRef,
    private playersStore: PlayersStore
  ) {}

  @ViewChild(MatSort) sort!: MatSort;

  readonly dataSource = new MatTableDataSource<TPlayer>([]);
  readonly displayedColumns: (keyof TPlayer | 'actions')[] = [
    'avatar',
    'name',
    'surname',
    'nickname',
    'actions',
  ];

  ngOnDestroy() {}

  ngOnInit() {
    this.playersStore.players$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((players) => {
        this.dataSource.data = players;
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  toggleCaptain(player: TPlayer) {
    this.playersStore.tryToggleCaptain({
      ...player,
      isCaptain: !player.isCaptain,
    });
  }
}
