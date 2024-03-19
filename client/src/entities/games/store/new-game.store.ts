import { TPlayer } from '../../players/types/index';
// TODO REMOVE AS DEP
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { Injectable, InjectionToken, computed, inject } from '@angular/core';
import { TeamEnum } from '@shared/constants/team';
import { PlayersService } from '@entities/players/services/players.service';
import {
  EMPTY,
  catchError,
  delay,
  finalize,
  map,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

export type GameTeam = { name: TeamEnum; disable: boolean };
export type GameGoal = {
  pass: number;
  goal: number;
  goalHead: number;
  autoGoal: number;
};
export type GamePlayerInternalProcessProps = {
  team: TeamEnum | null;
  transferable: boolean;
  disableAsPlayer: boolean;
  disableAsCaptain: boolean;
};
export type GamePlayer = TPlayer & GamePlayerInternalProcessProps & GameGoal;

// Exclude<keyof GamePlayer, 'team' | 'disable'>
export type GamePlayerStatisticKeys =
  | 'pass'
  | 'goal'
  | 'goalHead'
  | 'goalHead'
  | 'autoGoal';

export interface NewGameState {
  status: any;
  loading: boolean;
  teams: GameTeam[];
  players: GamePlayer[];
  goals: GameGoal[];
}

const INITIAL_PLAYERS_STATE: NewGameState = {
  status: '',
  loading: false,
  players: [],
  goals: [],
  teams: [
    { name: TeamEnum.teamA, disable: false },
    { name: TeamEnum.teamB, disable: false },
  ],
};

// Read https://offering.solutions/blog/articles/2023/12/03/ngrx-signal-store-getting-started/

export const NewGameStore = signalStore(
  withState(INITIAL_PLAYERS_STATE),

  withComputed(({ teams, players }) => ({
    // Teams
    teamsAreDisabled: computed(() => teams().every(team => team.disable)),
    // Players
    captains: computed(() =>
      players().filter(({ isCaptain }) => Boolean(isCaptain)),
    ),
  })),
  withMethods((store, playersService = inject(PlayersService)) => ({
    // init: rxMethod<void>(pipe()),
    init: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, { loading: true });
        }),
        delay(2500),
        switchMap(() =>
          playersService.getPlayers().pipe(
            tap(players => {
              console.log(
                'players',
                players,
                typeof players,
                Array.isArray(players),
              );

              patchState(store, {
                players: players.map(player => ({
                  ...player,
                  pass: 0,
                  goal: 0,
                  goalHead: 0,
                  autoGoal: 0,

                  // additional
                  team: null,
                  disableAsPlayer: false,
                  disableAsCaptain: false,
                  transferable: false,
                })),
              });
            }),

            catchError(error => {
              console.error('GameStore Crashed with error:', error);
              return EMPTY;
            }),
            finalize(() => {
              patchState(store, { loading: false });
            }),
          ),
        ),
      ),
    ),
    // Teams
    updateTeam(teamToUpdate: GameTeam): void {
      patchState(store, state => {
        return {
          teams: state.teams.map(team => {
            if (team.name === teamToUpdate.name) {
              return teamToUpdate;
            }
            return team;
          }),
        };
      });
    },

    // Captains
    updateCaptain(captainToUpdate: GamePlayer): void {
      patchState(store, state => {
        return {
          players: state.players.map(player => {
            if (player.id === captainToUpdate.id) {
              return captainToUpdate;
            }
            return player;
          }),
        };
      });
    },
    // Players
    setPlayers(team: TeamEnum | null, addedPlayers: GamePlayer[]): void {
      // Set added players
      patchState(store, state => {
        return {
          // Reset all player belonging to current team
          players: state.players
            // .map(player => {
            //   // Skip players if
            //   if (player.team !== team || player.transferable) {
            //     return player;
            //   }

            //   return {
            //     ...player,
            //     disable: false,
            //     team: null,
            //   };
            // })
            /**
             * Check player exists in added players
             *
             * Player exist in added players set:
             *  + update player with team and set disable (selected) true
             *  - skip player
             *
             * TODO: make it readable
             */
            .map(player => {
              // An
              if (player.team && player.team !== team) {
                return player;
              }

              if (player.transferable) {
                return player;
              }

              return addedPlayers.find(added => added.id === player.id)
                ? { ...player, disableAsPlayer: true, team }
                : {
                    ...player,
                    disableAsPlayer: false,
                    team: null,
                  };
            }),
        };
      });
    },
    patchPlayerStats: ({
      player: { id, team },
      action,
      key,
    }: {
      player: GamePlayer;
      action: 'decrement' | 'increment';
      key: GamePlayerStatisticKeys;
    }): void => {
      patchState(store, state => {
        return {
          players: state.players.map(player => {
            if (player.id === id && player.team === team) {
              if (action === 'decrement') {
                player[key] -= 1;
              } else {
                player[key] += 1;
              }
              return player;
            }
            return player;
          }),
        };
      });
    },
    playerToggleTransferable: (
      player: GamePlayer,
      transferable: boolean,
    ): void => {
      console.group('playerToggleTransferable');
      console.log(player, transferable);
      /**
       * If transferable turn:on:
       *
       * + replace player with transferable but set team as null
       * + add new empty player
       */
      if (transferable) {
        patchState(store, state => {
          return {
            players: [
              // TODO: make map instead filter
              ...state.players.filter(pl => pl.id !== player.id),
              // Same player but + transferable
              {
                ...player,
                transferable,
              },
              // Similar player + transferable
              {
                ...player,
                transferable,
                pass: 0,
                goal: 0,
                goalHead: 0,
                autoGoal: 0,
                team:
                  player.team === TeamEnum.teamA
                    ? TeamEnum.teamB
                    : TeamEnum.teamA,
              },
            ],
          };
        });

        return;
      }

      /**
       * If transferable turn:off
       *
       * + remove player
       */
      patchState(store, state => {
        return {
          players: [
            ...state.players.filter(pl => pl.id !== player.id),
            {
              ...player,
              transferable,
            },
          ],
        };
      });

      console.groupEnd();
    },
  })),
  // Should be latest to read methods
  withHooks({
    onInit({ init }) {
      console.info('new game store 2 initialization...');
      init();
    },
    onDestroy({ players }) {
      console.info('players on destroy', players());
    },
  }),
);
