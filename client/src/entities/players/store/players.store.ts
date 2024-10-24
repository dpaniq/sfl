import { computed, inject } from '@angular/core';
import { TPlayerFinal } from '@entities/games/types';
import { PlayersService } from '@entities/players/services/players.service';
import {
  patchState,
  signalStore,
  type,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  entityConfig,
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  catchError,
  delay,
  EMPTY,
  finalize,
  first,
  firstValueFrom,
  of,
  pipe,
  switchMap,
  tap,
} from 'rxjs';

const PLAYERS_ENTITY_CONFIG = entityConfig({
  entity: type<TPlayerFinal>(),
  collection: 'players',
  selectId: player => player.id,
});

const FEATURE_NAME = 'PLAYERS';

const FEATURE_INITIALIZED = `[${FEATURE_NAME} STORE FEATURE] has been initialized 🚀`;

const FEATURE_DESTROYED = `[${FEATURE_NAME} STORE FEATURE] destroyed 💥`;

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
  withEntities(PLAYERS_ENTITY_CONFIG),
  withComputed(({ players, loading, initLoading }) => ({
    loading: computed(() => loading() || initLoading()),
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
      updateOne(player: TPlayerFinal): void {
        patchState(store, { loading: true });
        of(player)
          .pipe(delay(1000))
          .subscribe(() => {
            patchState(
              store,
              updateEntity(
                {
                  id: player.id,
                  changes: player,
                },
                PLAYERS_ENTITY_CONFIG,
              ),
            );
            patchState(store, { loading: false });
          });
      },
      deleteOne(id: string): void {
        patchState(store, { loading: true });
        of(id)
          .pipe(delay(1000))
          .subscribe(() => {
            patchState(store, removeEntity(id, PLAYERS_ENTITY_CONFIG), {
              loading: false,
            });
          });
      },
      init: rxMethod<void>(
        pipe(
          first(),
          tap(() => patchState(store, { loading: true, initLoading: true })),
          delay(1500),
          switchMap(() => playersService.find()),
          tap(players => {
            patchState(store, setAllEntities(players, PLAYERS_ENTITY_CONFIG));
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
  withHooks({
    onInit({ init }) {
      init();
      console.log(FEATURE_INITIALIZED);
    },
    onDestroy() {
      console.log(FEATURE_DESTROYED);
    },
  }),
);
