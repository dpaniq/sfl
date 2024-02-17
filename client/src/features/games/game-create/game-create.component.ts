import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { isSaturday, previousSaturday, subWeeks } from 'date-fns';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, take } from 'rxjs';
import { ISOWeekPipe } from './iso-week.pipe';
import { getLastSaturday, totalWeeksByYear } from './utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TeamCreateComponent } from 'src/features/team/team-create/team-create.component';
import { provideComponentStore } from '@ngrx/component-store';
import { NewGameStore } from '@entities/games';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'sfl-game-create',
  standalone: true,
  imports: [
    CommonModule,

    // Material
    MatButtonModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    ReactiveFormsModule,

    // Custom
    TeamCreateComponent,
    ISOWeekPipe,
  ],
  templateUrl: './game-create.component.html',
  styleUrl: './game-create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(NewGameStore)],
})
export class GameCreateComponent implements OnInit {
  #destroyRef = inject(DestroyRef);
  #newGameStore = inject(NewGameStore);

  lastSaturday = getLastSaturday;
  minDate = '2010-01-01';
  maxDate = isSaturday(new Date()) ? new Date() : previousSaturday(new Date());

  formGroup = new FormGroup({
    state: new FormControl<any>(null),
    playedAt: new FormControl<Date>(this.lastSaturday, { nonNullable: true }),
  });

  isSaturday = isSaturday;
  totalWeeks = totalWeeksByYear(getLastSaturday);

  get playedAtFC() {
    return this.formGroup.controls.playedAt;
  }

  ngOnInit() {
    this.playedAtFC.valueChanges
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((date) => {
        this.totalWeeks = totalWeeksByYear(date);
      });
  }

  save() {
    this.#newGameStore.players$.pipe(take(1)).subscribe((player) => {
      this.formGroup.controls.state.patchValue(player);
    });
  }
}
