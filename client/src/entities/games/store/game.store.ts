import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { NEVER, catchError, delay, pipe, switchMap, tap } from 'rxjs';
import { GameService } from '../services/game.service';
import { IGame } from '../types';

export interface GameState {
  games: IGame[];

  // For internal process
  loading: boolean;
  errors: string[];
}

const INITIAL_NEW_GAME_STATE: GameState = {
  games: [],

  // For internal process
  loading: false,
  errors: [],
};

export const GameStore = signalStore(
  withState(INITIAL_NEW_GAME_STATE),
  withMethods(
    (
      store,
      { gameService } = {
        gameService: inject(GameService),
      },
    ) => ({
      // Game
      initGames: rxMethod<void>(
        pipe(
          tap(() => patchState(store, () => ({ loading: true }))),
          delay(2500),
          switchMap(() => gameService.find()),
          tap(games => {
            console.log('[GameStore]: tap games', games);
            patchState(store, () => ({
              games,
              loading: false,
            }));
          }),
          catchError(error => {
            console.error('[GameStore]: crashed with error:', error);
            patchState(store, () => ({
              errors: ['[GameStore]: crashed while initializing'],
            }));
            return NEVER;
          }),
        ),
      ),
    }),
  ),
  // Should be latest to read methods
  withHooks({
    onInit({ initGames }) {
      console.info('[GameStore]: game store initialization...');
      initGames();
    },
    onDestroy() {
      console.info('[GameStore]: game store on destroy');
    },
  }),
);
