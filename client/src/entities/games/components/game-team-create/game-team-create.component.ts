import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';

import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

import { EnumGameMode } from '@entities/games/constants';
import { GameTeam, NewGameStore } from '@entities/games/store/new-game.store';
import { TTeamFinal } from '@entities/games/types';
import { PlayersAutocompleteComponent } from '@entities/players/components/players-autocomplete/players-autocomplete.component';
import { distinctUntilChanged, startWith } from 'rxjs';
import { GameCreatePlayerStatisticsComponent } from '../game-create-player-statistics/game-create-player-statistics.component';

@Component({
  selector: 'sfl-game-team-create',
  standalone: true,
  imports: [
    CommonModule,
    // Material
    // TODO REMOVE EXTRA MATERIALS
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    // Custom
    // TODO FIX
    GameCreatePlayerStatisticsComponent,
    PlayersAutocompleteComponent,
  ],
  templateUrl: './game-team-create.component.html',
  styleUrl: './game-team-create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameTeamCreateComponent implements OnInit, OnDestroy {
  #destroyRef = inject(DestroyRef);
  readonly newGameStore = inject(NewGameStore);

  public team = input.required<TTeamFinal>();
  public mode = input.required<EnumGameMode>();
  public readonly teamId = computed(() => this.team().id);

  public readonly getState = computed(() => [
    this.newGameStore.statistics(),
    this.newGameStore.statisticsEntities(),
  ]);

  get captainFC() {
    return this.formGroup.controls.captain;
  }

  get playersFC() {
    return this.formGroup.controls.players;
  }

  /**
   * https://stackblitz.com/edit/angular-sx79hu?embed=1&file=app/multiselect-autocomplete-example.html
   * https://stackoverflow.com/questions/49131094/is-there-a-way-to-make-a-multiselection-in-autocomplete-angular4
   * https://stackblitz.com/run?file=src%2Fexample%2Fchips-autocomplete-example.html
   * https://material.angular.io/components/chips/examples
   */
  public value = signal<string>('');

  readonly formGroup = new FormGroup({
    // team: new FormControl<GameTeam | null>(this.team),
    captain: new FormControl<any | null>({
      value: null,
      disabled: false,
    }),
    players: new FormControl<any[]>(
      { value: [], disabled: true },
      { nonNullable: true },
    ),
  });

  captainsSignal = computed(() => {
    this.newGameStore.captains();
  });

  ngOnDestroy() {}

  readonly storeLoaded$ = toObservable(this.newGameStore.storeLoaded);

  ngOnInit(): void {
    this.storeLoaded$
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.#destroyRef))
      .subscribe(storeLoaded => {});

    this.playersFC.valueChanges
      .pipe(
        startWith(this.playersFC.value),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(players => {});
  }

  teamCompareFn(option: GameTeam | null, value: GameTeam | null) {
    return option?.id === value?.id;
  }

  captainCompareFn(option: any | null, value: any | null) {
    return option?.id === value?.id;
  }

  playersCompareFn(option: any | null, value: any) {
    return option?.id === value?.id;
  }
}
