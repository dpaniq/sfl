import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
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
import { map, pairwise, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {
  GamePlayer,
  GameTeam,
  NewGameStore,
} from '@entities/games/store/new-game.store';
import { GameCreatePlayerStatisticsComponent } from '../game-create-player-statistics/game-create-player-statistics.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

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

  get teamFC() {
    return this.formGroup.controls.team;
  }

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
    team: new FormControl<GameTeam | null>(null),
    captain: new FormControl<GamePlayer | null>({
      value: null,
      disabled: true,
    }),
    players: new FormControl<GamePlayer[]>(
      { value: [], disabled: true },
      { nonNullable: true },
    ),
  });

  teamSignal = this.newGameStore.teams;
  captainsSignal = computed(() => {
    return this.newGameStore
      .captains()
      .filter(
        player =>
          player.teamId === this.teamFC.value?.id ||
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
          player.teamId === this.teamFC.value?.id ||
          !player.disableAsPlayer ||
          (player.disableAsPlayer && player.transferable),
      );
  });

  playersOfCurrentTeamSignal = computed(() => {
    return this.newGameStore
      .players()
      .filter(
        player => player.teamId && player.teamId === this.teamFC.value?.id,
      );
  });

  ngOnInit(): void {
    this.teamFC.valueChanges
      .pipe(
        startWith(this.teamFC.value),
        pairwise(),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(([prevTeam, currentTeam]) => {
        console.log('set Team', prevTeam, currentTeam);

        // To relax previous team
        if (prevTeam) {
          this.newGameStore.updateTeam({ ...prevTeam, disable: false });
        }

        // To set new team (from available)
        if (currentTeam) {
          this.newGameStore.updateTeam({ ...currentTeam, disable: true });
          this.captainFC.enable();
        } else {
          // If no current team
          this.captainFC.reset();
          this.captainFC.disable();
          this.playersFC.reset();
          this.playersFC.disable();
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
            teamId: this.teamFC.value?.id ?? null,
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
            teamId: this.teamFC.value?.id ?? null,
            disableAsPlayer: true,
          })),
        ),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(players => {
        this.newGameStore.setPlayers(this.teamFC.value?.id ?? null, players);
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
