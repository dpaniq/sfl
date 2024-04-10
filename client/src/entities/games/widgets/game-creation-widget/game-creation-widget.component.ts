import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  Injector,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GameService,
  GameTeamCreateComponent,
  NewGameStore,
} from '@entities/games';
import { EnumGameMode, EnumGameStatus } from '@entities/games/constants';
import { IGame } from '@entities/games/types';
import { PlayersService } from '@entities/players/services/players.service';
import { ITeam, TeamsService } from '@entities/teams';
import { getLastSaturday, totalWeeksByYear } from '@entities/utils/date';
import { getState } from '@ngrx/signals';
import { ISOWeekPipe } from '@shared/pipes/iso-week.pipe';
import { getYear, isDate, isSaturday, previousSaturday } from 'date-fns';
import { range } from 'lodash-es';
import { distinctUntilChanged, filter, map } from 'rxjs';

@Component({
  selector: 'sfl-game-creation-widget',
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
  templateUrl: './game-creation-widget.component.html',
  styleUrl: './game-creation-widget.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NewGameStore, GameService, PlayersService],
})
export class GameCreationWidgetComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  readonly newGameStore = inject(NewGameStore);
  readonly gameService = inject(GameService);
  readonly teamsService = inject(TeamsService);
  readonly activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly injector = inject(Injector);

  lastSaturday = getLastSaturday;
  minDate = '2010-01-01';
  maxDate = isSaturday(new Date()) ? new Date() : previousSaturday(new Date());

  readonly enumGameStatus = EnumGameStatus;

  public readonly numbers = signal<number[]>(range(1, 54));
  public readonly seasons = signal<number[]>(
    range(2010, getYear(new Date()) + 1),
  );
  public readonly teams = computed(() => {
    return Object.values(this.newGameStore.game.teams()) ?? [];
  });

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

  // Store signals
  public readonly modeSignal = this.newGameStore.mode;
  readonly isFormChangedSignal = this.newGameStore.isFormChanged;
  readonly loadingSignal = computed(
    () => this.newGameStore.loading() || this.newGameStore.initLoading(),
  );

  ngOnInit() {
    toObservable(this.newGameStore.initLoading, { injector: this.injector })
      .pipe(
        distinctUntilChanged(),
        filter(loading => !loading),
        map(() => this.newGameStore.mode()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(mode => {
        if (mode === EnumGameMode.Unknown) {
          this.router.navigate(['games']);
        }

        if (mode === EnumGameMode.Init) {
          return;
        }

        this.fillControls(this.newGameStore.game());
      });

    this.playedAtFC.valueChanges
      .pipe(filter(Boolean), takeUntilDestroyed(this.destroyRef))
      .subscribe(date => {
        this.totalWeeks = totalWeeksByYear(date);
      });

    this.formGroup.controls.status.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(status => {
        this.newGameStore.updateStatus(status);
      });
  }

  save() {
    const raw = this.formGroup.getRawValue();
    const state = getState(this.newGameStore);
    const game = state.game;

    this.gameService
      .save({
        status: EnumGameStatus.New,
        number: raw.number,
        season: raw.season,
        playedAt: raw.playedAt,
        teams: game.teams,
        statistics: game.statistics,
      })
      .subscribe(game => console.log('GAME IS SAVED', game));

    this.newGameStore.initGame();
  }

  // TODO REPLACE
  update() {
    const state = getState(this.newGameStore);
    const game = state.game;

    this.gameService
      .resave(game.id!, {
        status: game.status,
        number: game.number,
        season: game.season,
        playedAt: game.playedAt,
        teams: game.teams,
        statistics: game.statistics,
      })
      .subscribe(game => console.log('GAME IS UPDATED', game));

    this.newGameStore.initGame();
  }

  drop(event: CdkDragDrop<ITeam[]>) {
    const array = this.teams();

    if (!array) {
      return;
    }

    moveItemInArray(array, event.previousIndex, event.currentIndex);

    this.newGameStore.updateTeams(array);

    // TODO not needed fix
    // this.teams.set(array);
  }

  private fillControls({
    number,
    season,
    status,
    teams,
    playedAt,
  }: Partial<IGame>) {
    console.log('fillControls', { number, season, status, teams, playedAt });

    // TODO not needed
    if (teams) {
      // this.teams.set(Object.values(teams));
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

    // TODO [!]
    if (playedAt && isDate(new Date(playedAt))) {
      this.formGroup.controls.playedAt.setValue(new Date(playedAt!));
    }
  }
}
