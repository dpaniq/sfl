import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { combineLatest, filter, map, pairwise, startWith, tap } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {
  GamePlayer,
  GameTeam,
  NewGameMode,
  NewGameStore,
} from '@entities/games/store/new-game.store';
import { GameCreatePlayerStatisticsComponent } from '../game-create-player-statistics/game-create-player-statistics.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ITeam } from '@entities/teams';

@Component({
  selector: 'sfl-game-team-create',
  standalone: true,
  imports: [
    CommonModule,
    // Material
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
  ],
  templateUrl: './game-team-create.component.html',
  styleUrl: './game-team-create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameTeamCreateComponent implements OnInit {
  #destroyRef = inject(DestroyRef);
  readonly newGameStore = inject(NewGameStore);

  public team = input.required<ITeam>();
  public readonly teamId = computed(() => this.team()._id);

  // get teamFC() {
  //   return this.formGroup.controls.team;
  // }

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
    captain: new FormControl<GamePlayer | null>({
      value: null,
      disabled: false,
    }),
    players: new FormControl<GamePlayer[]>(
      { value: [], disabled: true },
      { nonNullable: true },
    ),
  });

  captainsSignal = computed(() => {
    return this.newGameStore.captains().filter(
      player =>
        // player.teamId === this.teamFC.value?.id ||
        player.teamId === this.teamId() ||
        (!player.disableAsPlayer && !player.disableAsCaptain),
    );
  });

  playersSignal = computed(() => {
    return this.newGameStore
      .players()
      .filter(player => {
        if (player.disableAsPlayer) {
          return player;
        }
        const pattern = RegExp(`${this.value()}`);
        return pattern.test(player.nickname);
      })
      .filter(
        player =>
          // player.teamId === this.teamFC.value?.id ||
          player.teamId === this.teamId() ||
          !player.disableAsPlayer ||
          (player.disableAsPlayer && player.transferable),
      );
  });

  playersOfCurrentTeamSignal = computed(() => {
    return this.newGameStore.players().filter(
      // player => player.teamId && player.teamId === this.teamFC.value?.id,
      player => player.teamId && player.teamId === this.teamId(),
    );
  });

  effectMode = effect(() => {
    const mode = this.newGameStore.mode();
    console.log(mode);
  });

  private readonly modeEdit$ = combineLatest([
    toObservable(this.newGameStore.mode),
    toObservable(this.newGameStore.loading),
  ]).pipe(
    tap(mode => console.log(mode)),
    filter(([mode, loading]) => loading === false && mode === NewGameMode.Edit),
    takeUntilDestroyed(this.#destroyRef),
  );
  //   .subscribe(mode => {
  //     console.log({ mode });
  //   });

  ngOnInit(): void {
    // Fill in controls if mode is edit
    this.modeEdit$.subscribe(() => {
      // Init captain
      const captain = this.newGameStore.players().find(player => {
        return player.disableAsCaptain && player.teamId === this.teamId();
      });

      if (captain) {
        this.captainFC.setValue(captain, { emitEvent: false });
      }

      // Init players
      const players = this.newGameStore.players().filter(player => {
        console.log('FIND PLAYER BY TEAM', player.teamId, this.teamId());
        return player.teamId === this.teamId();
      });

      console.log('FILTERED PLAYERS:', players, players.length);

      if (players.length) {
        this.playersFC.setValue(players, { emitEvent: false });
      }
    });

    this.captainFC.valueChanges
      .pipe(
        startWith(this.captainFC.value),
        pairwise(),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(([prevCaptain, currentCaptain]) => {
        console.log('setCaptain', prevCaptain, currentCaptain);

        if (prevCaptain) {
          this.newGameStore.updateCaptain({
            ...prevCaptain,
            teamId: null,
            disableAsCaptain: false,
          });
        }

        // Set new player to PlayerFC & disable / enable playersFC
        if (currentCaptain) {
          this.playersFC.enable();
          this.playersFC.reset([currentCaptain]);
          this.newGameStore.updateCaptain({
            ...currentCaptain,
            // teamId: this.teamFC.value?.id ?? null,
            teamId: this.teamId() ?? null,
            disableAsCaptain: true,
            disableAsPlayer: true,
          });
        } else {
          this.playersFC.disable();
          this.playersFC.reset();
        }
      });

    this.playersFC.valueChanges
      .pipe(
        startWith(this.playersFC.value),
        map(players =>
          players.map(player => ({
            ...player,
            // teamId: this.teamFC.value?.id ?? null,
            teamId: this.teamId() ?? null,
            disableAsPlayer: true,
          })),
        ),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(players => {
        console.log('SET PLAYERS', players);
        this.newGameStore.setPlayers(this.teamId() ?? null, players);
      });
  }

  teamCompareFn(option: GameTeam | null, value: GameTeam | null) {
    return option?.id === value?.id;
  }

  captainCompareFn(option: GamePlayer | null, value: GamePlayer | null) {
    // console.log(option?.id, value?.id, option?.id === value?.id);
    return option?.id === value?.id;
  }

  playersCompareFn(option: GamePlayer | null, value: GamePlayer) {
    return option?.id === value?.id;
  }
}
