import { computed, inject } from '@angular/core';
import { TPlayerFinal } from '@entities/games/types';
import { PlayersService } from '@entities/players/services/players.service';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  catchError,
  delay,
  EMPTY,
  finalize,
  firstValueFrom,
  pipe,
  switchMap,
  tap,
} from 'rxjs';

export interface PlayersStoreState {
  players: TPlayerFinal[];

  // For internal process
  loading: boolean;
  initLoading: boolean;
  errors: [];
}

const INITIAL_NEW_PLAYERS_STATE: PlayersStoreState = {
  players: [],

  // For internal process
  loading: false,
  initLoading: true,
  errors: [],
};

export const PlayersStore = signalStore(
  withState(INITIAL_NEW_PLAYERS_STATE),

  withComputed(({ players, initLoading }) => ({
    storeLoaded: computed(() => !initLoading()),
    // Players
    captains: computed(() =>
      players().filter(({ isCaptain }) => Boolean(isCaptain)),
    ),
  })),
  withMethods(
    (
      store,
      { playersService } = {
        playersService: inject(PlayersService),
      },
    ) => ({
      patch: async (player: WithId<TPlayerFinal>): Promise<void> => {
        const patchedPlayer = await firstValueFrom(
          playersService.patch(player.id, { isCaptain: !player.isCaptain }),
        );

        patchState(store, state => {
          return {
            players: state.players.map(player => {
              if (player.id === patchedPlayer?.id) {
                return patchedPlayer;
              }
              return player;
            }),
          };
        });
      },
      init: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true, initLoading: true })),
          delay(2500),
          switchMap(() => playersService.find()),
          tap(players => {
            patchState(store, { players });
          }),
          catchError(error => {
            console.error('Players store have been crashed with error:', error);
            return EMPTY;
          }),
          finalize(() => {
            console.log('FINALIZE: Players INITED', {
              loading: false,
              initLoading: false,
            });
            patchState(store, { loading: false, initLoading: false });
          }),
        ),
      ),
    }),
  ),
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
