import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { isSaturday, previousSaturday } from 'date-fns';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { ISOWeekPipe } from './iso-week.pipe';
import { getLastSaturday, totalWeeksByYear } from './utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TeamCreateComponent } from 'src/features/team/team-create/team-create.component';
import { provideComponentStore } from '@ngrx/component-store';
import { MatButtonModule } from '@angular/material/button';
import { NewGameStore } from '@entities/games/store/new-game.store';
import { getState } from '@ngrx/signals';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GameService } from '@entities/games';

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
    MatProgressBarModule,

    // Custom
    TeamCreateComponent,
    ISOWeekPipe,
  ],
  templateUrl: './game-create.component.html',
  styleUrl: './game-create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NewGameStore, GameService],
})
export class GameCreateComponent implements OnInit {
  #destroyRef = inject(DestroyRef);
  readonly newGameStore = inject(NewGameStore);
  readonly gameService = inject(GameService);

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
      .subscribe(date => {
        this.totalWeeks = totalWeeksByYear(date);
      });
  }

  save() {
    const state = getState(this.newGameStore);
    this.gameService.save(this.playedAtFC.value, state);
  }
}
