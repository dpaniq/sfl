import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { getYear, isDate, isSaturday, previousSaturday } from 'date-fns';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { filter, map, take } from 'rxjs';
import { ISOWeekPipe } from './iso-week.pipe';
import { getLastSaturday, totalWeeksByYear } from './utils';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { NewGameStore } from '@entities/games/store/new-game.store';
import { getState } from '@ngrx/signals';

import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
  CdkDragHandle,
} from '@angular/cdk/drag-drop';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GameService, GameTeamCreateComponent } from '@entities/games';
import { IGame, IPlayerStatistic } from '@entities/games/types';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { EnumGameStatus } from '@entities/games/constants';
import { ITeam } from '@entities/teams';
import { EnumTeamColor } from '@entities/teams/constants';
import { range } from 'lodash';
import { TeamsService } from '../../../teams/teams.service';

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

    // CDK
    CdkDropList,
    CdkDrag,
    CdkDragHandle,

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
  readonly teamsService = inject(TeamsService);
  readonly activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);

  lastSaturday = getLastSaturday;
  minDate = '2010-01-01';
  maxDate = isSaturday(new Date()) ? new Date() : previousSaturday(new Date());

  readonly enumGameStatus = EnumGameStatus;

  public readonly mode = signal<undefined | 'create' | 'edit'>(undefined);
  public readonly numbers = signal<number[]>(range(1, 54));
  public readonly seasons = signal<number[]>(
    range(2010, getYear(new Date()) + 1),
  );
  // public readonly teams = toSignal<ITeam[]>(
  //   ,
  // );
  public readonly teams = signal<ITeam[]>([]);

  public readonly state = this.newGameStore;

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
    // teams: new FormControl<ITeam[]>([

    // ]),
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

  // get teamsFC() {
  //   return this.formGroup.controls.teams;
  // }

  ngOnInit() {
    const urlParamMap = this.activatedRoute.snapshot.paramMap;
    const urlQueryParamMap = this.activatedRoute.snapshot.queryParamMap;
    const urlSegments = this.activatedRoute.snapshot.url.map(
      segment => segment.path,
    );

    switch (true) {
      // Create
      case urlSegments.includes('create'): {
        if (urlQueryParamMap.has('number')) {
          this.formGroup.controls.number.setValue(
            Number(urlQueryParamMap.get('number')),
          );
        }

        if (urlQueryParamMap.has('season')) {
          this.formGroup.controls.season.setValue(
            Number(urlQueryParamMap.get('season')),
          );
        }

        // TODO [!]
        if (
          urlQueryParamMap.has('playedAt') &&
          urlQueryParamMap.get('playedAt') &&
          isDate(new Date(urlQueryParamMap.get('playedAt')!))
        ) {
          this.formGroup.controls.playedAt.setValue(
            new Date(urlQueryParamMap.get('playedAt')!),
          );
        }

        this.mode.set('create');
        break;
      }

      // Edit
      case urlSegments.includes('edit'): {
        this.gameService
          .find({
            id: urlParamMap.get('id') ?? '',
          })
          .pipe(
            take(1),
            map(games => games.at(0)),
            takeUntilDestroyed(this.destroyRef),
          )
          .subscribe(game => {
            if (!game) {
              // TODO error / dialog?
              return;
            }
            const { number, season, statistics, status, teams, playedAt } =
              game;
            console.log(game);

            if (teams) {
              this.teams.set(Object.values(teams));
            }

            if (number) {
              this.formGroup.controls.number.setValue(Number(number));
            }

            if (season) {
              this.formGroup.controls.season.setValue(Number(season));
            }

            if (status) {
              this.formGroup.controls.status.setValue(status);
              this.formGroup.controls.status.enable();
            }

            if (statistics) {
              // console.log({ statistics });
              // this.newGameStore.resetPlayers(statistics);
            }

            // TODO [!]
            if (playedAt && isDate(new Date(playedAt))) {
              this.formGroup.controls.playedAt.setValue(new Date(playedAt!));
            }
          });
        this.mode.set('edit');
        break;
      }
      default:
        this.router.navigate(['games']);
    }

    // Init values
    this.teamsService
      .find()
      .pipe(
        map(teams => teams ?? []),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(teams => {
        this.teams.set(teams);
      });

    this.playedAtFC.valueChanges
      .pipe(filter(Boolean), takeUntilDestroyed(this.destroyRef))
      .subscribe(date => {
        this.totalWeeks = totalWeeksByYear(date);
      });
  }

  save() {
    const state = getState(this.newGameStore);

    const teams = Object.fromEntries(
      this.teams().map((team, index) => {
        return [index, team];
      }),
    );

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
          pass: statistic.pass,
          mvp: false,

          // Check backend schema
          isCaptain: statistic.disableAsCaptain,
        };
      });

    const raw = this.formGroup.getRawValue();

    this.gameService
      .save({
        status: EnumGameStatus.New,
        number: raw.number,
        season: raw.season,
        teams,
        playedAt: raw.playedAt,
        statistics,
      })
      .subscribe(game => console.log('GAME IS SAVED', game));
  }

  update() {
    const state = getState(this.newGameStore);

    const teams = Object.fromEntries(
      this.teams().map((team, index) => {
        return [index, team];
      }),
    );

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
          pass: statistic.pass,
          mvp: false,

          // Check backend schema
          isCaptain: statistic.disableAsCaptain,
        };
      });

    const { number, season, playedAt, status } = this.formGroup.getRawValue();

    const id = this.activatedRoute.snapshot.paramMap.get('id') ?? 'unknown';
    this.gameService
      .resave(id, {
        status,
        number,
        season,
        playedAt,
        teams,
        statistics,
      })
      .subscribe(game => console.log('GAME IS SAVED', game));
  }

  drop(event: CdkDragDrop<ITeam[]>) {
    const array = this.teams();

    if (!array) {
      return;
    }

    moveItemInArray(array, event.previousIndex, event.currentIndex);
    // this.teamsFC.patchValue(array);
    this.teams.set(array);
  }

  // private fillInNewGame(map) {

  // }
}
