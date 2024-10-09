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
import { MatListModule } from '@angular/material/list';
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
import { TTeamFinal } from '@entities/games/types';
import { PlayersService } from '@entities/players/services/players.service';
import { TeamsService } from '@entities/teams';
import { getLastSaturday, totalWeeksByYear } from '@entities/utils/date';
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
    MatListModule,

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
  // public readonly teams = computed(() => {
  //   return Object.values(this.newGameStore.game().teams) ?? [];
  // });
  public readonly teams = this.newGameStore.teamsEntities;

  public readonly state = this.newGameStore;
  protected readonly gameId = this.newGameStore.game()?.id;
  protected readonly errors = this.newGameStore.errors;

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
  readonly storeLoaded = this.newGameStore.storeLoaded;

  ngOnInit() {
    toObservable(this.newGameStore.storeLoaded, { injector: this.injector })
      .pipe(
        distinctUntilChanged(),
        filter(Boolean),
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

        this.fillControls();
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
    this.newGameStore.saveGame();
  }

  // TODO REPLACE
  update() {
    this.newGameStore.updateGame();
  }

  delete() {
    this.newGameStore.deleteGame();
  }

  drop(event: CdkDragDrop<[TTeamFinal, TTeamFinal]>) {
    // TODO

    const array = this.teams();

    if (!array) {
      return;
    }
    console.log('drop!', array, event);

    moveItemInArray(array, event.previousIndex, event.currentIndex);

    this.newGameStore.updateTeams(array as [TTeamFinal, TTeamFinal]);
    // this.newGameStore.updateTeams(array);

    // TODO not needed fix
    // this.teams.set(array);
  }

  private fillControls() {
    console.log('fillControls');
    const { number, season, status, playedAt } = this.newGameStore.game();

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
