import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
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
import { TeamEnum } from '@shared/constants/team';
import { PlayersStore, TPlayer } from '@entities/players';
import { CaptainsStore, TCaptain } from '@entities/captains';
import { NewGameStore } from '@entities/games';
import {
  filter,
  map,
  pairwise,
  startWith,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {
  GamePlayer,
  GameTeam,
  NewGameState,
} from '@entities/games/store/new-game.store';

@Component({
  selector: 'sfl-team-create',
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
    ReactiveFormsModule,
  ],
  templateUrl: './team-create.component.html',
  styleUrl: './team-create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCreateComponent implements OnInit {
  #destroyRef = inject(DestroyRef);
  #newGameStore = inject(NewGameStore);

  get teamFC() {
    return this.formGroup.controls.team;
  }

  get captainFC() {
    return this.formGroup.controls.captain;
  }

  get playersFC() {
    return this.formGroup.controls.players;
  }

  readonly formGroup = new FormGroup({
    team: new FormControl<GameTeam | null>(null),
    captain: new FormControl<GamePlayer | null>({
      value: null,
      disabled: true,
    }),
    players: new FormControl<GamePlayer[]>(
      { value: [], disabled: true },
      { nonNullable: true }
    ),
  });

  teams$ = this.#newGameStore.teams$;
  captains$ = this.#newGameStore.captains$.pipe(
    withLatestFrom(this.formGroup.controls.team.valueChanges),

    tap((x) => console.log('WTF TAP,', x)),
    map(([players, team]) => {
      return players.filter(
        (player) => player.team === team?.name || !player.disable
      );
    })
  );
  players$ = this.#newGameStore.players$.pipe(
    withLatestFrom(this.teamFC.valueChanges),
    map(([players, team]) =>
      players.filter((player) => player.team === team?.name || !player.disable)
    ),
    tap((x) => console.log('players$', { x }))
  );
  teamPlayers$ = this.#newGameStore.players$.pipe(
    withLatestFrom(this.teamFC.valueChanges),
    map(([players, team]) => players.filter((player) => player.team === team)),
    tap((x) => console.log('teamPlayers$', { x }))
  );

  ngOnInit(): void {
    this.teamFC.valueChanges
      .pipe(
        startWith(this.teamFC.value),
        pairwise(),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(([prevTeam, currentTeam]) => {
        console.log('set Team', prevTeam, currentTeam);

        if (currentTeam) {
          this.#newGameStore.patchTeam({ ...currentTeam, disable: true });
        }

        if (prevTeam) {
          this.#newGameStore.patchTeam({ ...prevTeam, disable: false });
        }

        // Disable / enable captainFC
        currentTeam ? this.captainFC.enable() : this.captainFC.disable();
      });

    this.captainFC.valueChanges
      .pipe(
        startWith(this.captainFC.value),
        pairwise(),
        // withLatestFrom(this.teamFC.valueChanges.pipe(filter(Boolean), map(({name}) => name))),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(([prevCaptain, currentCaptain]) => {
        console.log('setCaptain', prevCaptain, currentCaptain);

        // this.#newGameStore.setPlayer({
        //   player: currentCaptain,
        //   team,
        // });

        // // TODO zdesj mozno if ne null (set isCaptain null)
        // this.#newGameStore.setPlayer({
        //   player: prevCaptain,
        //   team: null,
        // });

        // Set new player to PlayerFC
        // Disable / enable playersFC
        if (currentCaptain) {
          this.playersFC.enable();
          this.playersFC.setValue([currentCaptain]);
        } else {
          this.playersFC.disable();
          this.playersFC.reset([]);
        }
      });

    this.playersFC.valueChanges
      .pipe(
        startWith(this.playersFC.value),
        // pairwise(),
        withLatestFrom(
          this.#newGameStore.players$,
          this.teamFC.valueChanges.pipe(
            filter(Boolean),
            map(({ name }) => name)
          )
        ),
        map<[GamePlayer[], GamePlayer[], TeamEnum], GamePlayer[]>(
          // ([[prev, current], team]) => {
          ([playersFC, players, team]) => {
            const resetPlayers: GamePlayer[] = players.map((player) => {
              const foundFC = playersFC.find(({ id }) => id === player.id);

              if (foundFC) {
                return { ...player, team, disable: true };
              }
              // To keep player for another team
              if (player.team) {
                return player;
              }
              return { ...player, team: null, disable: false };
            });

            return resetPlayers;
          }
        ),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe((players) => {
        console.log('to set', players);

        // this.#newGameStore.setPlayer({
        //   player: prevPlayer,
        //   team,
        // });

        // // TODO zdesj mozno if ne null (set isCaptain null)
        // this.#newGameStore.setPlayer({
        //   player: currentPlayer,
        //   team: null,
        // });

        this.#newGameStore.patchPlayers(players);
      });
  }

  teamCompareFn(option: GameTeam | null, value: GameTeam | null) {
    console.log('teamCompareFn', option, value);
    return option?.name === value?.name;
  }

  captainCompareFn(option: GamePlayer | null, value: GamePlayer | null) {
    // console.log('captainCompareFn', option, value);
    return option?.id === value?.id;
  }

  playersCompareFn(option: GamePlayer | null, value: GamePlayer) {
    console.log('playersCompareFn', { option, value });
    // return !!value?.find((val) => val.id === option?.id);
    return option?.id === value?.id;
  }
}
