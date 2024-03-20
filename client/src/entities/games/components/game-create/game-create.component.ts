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
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { isDate, isSaturday, previousSaturday } from 'date-fns';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { filter } from 'rxjs';
import { ISOWeekPipe } from './iso-week.pipe';
import { getLastSaturday, totalWeeksByYear } from './utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { NewGameStore } from '@entities/games/store/new-game.store';
import { getState } from '@ngrx/signals';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GameService, GameTeamCreateComponent } from '@entities/games';
import { IGame, IPlayerStatistic } from '@entities/games/types';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { EnumGameStatus } from '@entities/games/constants';

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
    MatSelectModule,
    MatIconModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatProgressBarModule,

    // Custom
    GameTeamCreateComponent,
    ISOWeekPipe,
  ],
  templateUrl: './game-create.component.html',
  styleUrl: './game-create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NewGameStore, GameService],
})
export class GameCreateComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  readonly newGameStore = inject(NewGameStore);
  readonly gameService = inject(GameService);
  readonly activatedRoute = inject(ActivatedRoute);

  lastSaturday = getLastSaturday;
  minDate = '2010-01-01';
  maxDate = isSaturday(new Date()) ? new Date() : previousSaturday(new Date());

  readonly enumGameStatus = EnumGameStatus;

  formGroup = new FormGroup({
    number: new FormControl<number>(
      { value: 0, disabled: true },
      {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(1),
          Validators.min(53),
        ],
      },
    ),
    season: new FormControl<number>(
      { value: 0, disabled: true },
      {
        nonNullable: true,
        validators: [Validators.required, Validators.min(2010)],
      },
    ),
    playedAt: new FormControl<Date>(
      { value: new Date(), disabled: true },
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
    status: new FormControl<EnumGameStatus>(
      { value: EnumGameStatus.New, disabled: true },
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),
  });

  isSaturday = isSaturday;
  totalWeeks = totalWeeksByYear(getLastSaturday);

  get playedAtFC() {
    return this.formGroup.controls.playedAt;
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      console.log(queryParams);

      if ('number' in queryParams) {
        this.formGroup.controls.number.setValue(Number(queryParams['number']));
      }

      if ('season' in queryParams) {
        this.formGroup.controls.season.setValue(Number(queryParams['season']));
      }

      if (
        'playedAt' in queryParams &&
        isDate(new Date(queryParams['playedAt']))
      ) {
        this.formGroup.controls.playedAt.setValue(
          new Date(queryParams['playedAt']),
        );
      }
    });

    this.playedAtFC.valueChanges
      .pipe(filter(Boolean), takeUntilDestroyed(this.destroyRef))
      .subscribe(date => {
        this.totalWeeks = totalWeeksByYear(date);
      });
  }

  save() {
    const state = getState(this.newGameStore);

    const statistics: IPlayerStatistic[] = state.players
      .filter(
        ({ teamId, disableAsCaptain, disableAsPlayer }) =>
          !!teamId && (disableAsCaptain || disableAsPlayer),
      )
      .map(statistic => {
        return {
          playerId: statistic.id,
          teamId: statistic.teamId!,
          autoGoal: statistic.autoGoal,
          goal: statistic.goal,
          goalHead: statistic.goalHead,
          penalty: statistic.penalty,
          mvp: false,
        };
      });

    const raw = this.formGroup.getRawValue();

    this.gameService
      .save({
        status: EnumGameStatus.New,
        number: raw.number,
        season: raw.season,
        playedAt: raw.playedAt,
        statistics,
      })
      .subscribe(game => console.log('GAME IS SAVED', game));
  }
}
