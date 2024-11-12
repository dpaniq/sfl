import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewChild, OnDestroy, OnInit, AfterViewInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CaptainsStore, TCaptain } from '@entities/captains';

@Component({
  selector: 'sfl-captains-toggle',
  standalone: true,
  templateUrl: './captains-toggle.component.html',
  styleUrls: ['./captains-toggle.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
})
export class CaptainsToggleComponent implements OnDestroy, OnInit, AfterViewInit {
  constructor(
    private _destroyRef: DestroyRef,
    private captainsStore: CaptainsStore,
  ) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngOnDestroy() {}

  ngOnInit() {
    this.captainsStore.captains$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(captains => {
        this.dataSource.data = captains;
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  readonly dataSource = new MatTableDataSource<TCaptain>([]);
  readonly displayedColumns: (keyof TCaptain | 'actions')[] = [
    'avatar',
    // 'name',
    // 'surname',
    'nickname',
    'actions',
  ];

  onToggle(id: string, event: MatSlideToggleChange) {
    this.captainsStore.toggleCaptain({ id, isCaptain: event.checked });
  }
}
