import {
  ChangeDetectionStrategy,
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

import { CaptainsService, CaptainsStore, TCaptain } from '@entities/captains';
import { provideComponentStore } from '@ngrx/component-store';

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
  providers: [
    // Fixme: CaptainsStore uses CaptainsService, idk how to fix this
    // https://angular.io/api/core/FactoryProvider
    CaptainsService,

    // To use CaptainsService - useEffects
    provideComponentStore(CaptainsStore),
  ],
})
export class CaptainsToggleComponent {
  constructor(
    private _destroyRef: DestroyRef,
    private captainsStore: CaptainsStore
  ) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngOnDestroy() {}

  ngOnInit() {
    this.captainsStore.captains$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((captains) => {
        this.dataSource.data.push(...captains);
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  readonly dataSource = new MatTableDataSource<TCaptain>([]);
  readonly displayedColumns: (keyof TCaptain | 'actions')[] = [
    'avatar',
    'name',
    'surname',
    'nickname',
    'actions',
  ];

  onToggle(id: string, event: MatSlideToggleChange) {
    this.captainsStore.toggleCaptain({ id, isCaptain: event.checked });
  }
}
