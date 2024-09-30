import { computed, inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PlayersService } from '@entities/players/services/players.service';
import { TeamsService } from '@entities/teams';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TeamEnum } from '@shared/constants/team';
import { isDate } from 'date-fns';
import { cloneDeep, isEqual } from 'lodash-es';
import {
  EMPTY,
  Observable,
  catchError,
  delay,
  finalize,
  first,
  forkJoin,
  map,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { EnumGameMode, EnumGameStatus } from '../constants';
import { GameService } from '../services/game.service';
import {
  ITeamDTO,
  TGameFinal,
  TPlayerFinal,
  TPlayerStatisticFinal,
  TTeamFinal,
} from '../types';
import { withPlayersFeature } from './players.feature';
import { withPlayerStatisticsFeature } from './statistics.feature';
import { withTeamsFeature } from './teams.feature';

export type GameTeam = { id: string; name: TeamEnum; disable: boolean };

const FEATURE_NAME = 'NEW GAME';

const FEATURE_INITIALIZED = `[${FEATURE_NAME} STORE FEATURE] has been initialized 🚀`;

const FEATURE_DESTROYED = `[${FEATURE_NAME} STORE FEATURE] destroyed 💥`;

export interface NewGameState {
  game: TGameFinal;
  // One level game fields;
  teams: [TTeamFinal, TTeamFinal] | [];
  statistics: TPlayerStatisticFinal[];

  // Needed to keep all players with specific state
  players: TPlayerFinal[]; // TODO Cut

  // For internal process
  loading: boolean;
  initLoading: boolean;
  initialValue: null | TGameFinal;
  mode: EnumGameMode;
  errors: [];
}

export const INITIAL_GAME_STATE: TGameFinal = {
  id: undefined,
  number: 0,
  season: 0,
  teams: [],
  playedAt: new Date(),
  statistics: [],
  status: EnumGameStatus.New,
};

const INITIAL_NEW_GAME_STATE: NewGameState = {
  game: INITIAL_GAME_STATE,
  players: [],

  // One level game fields;
  teams: [],
  statistics: [],

  // For internal process
  loading: false,
  initLoading: true,
  initialValue: null,
  mode: EnumGameMode.Init,
  errors: [],
};

// Read https://offering.solutions/blog/articles/2023/12/03/ngrx-signal-store-getting-started/

export const NewGameStore = signalStore(
  withState(INITIAL_NEW_GAME_STATE),
  withTeamsFeature(),
  withPlayersFeature(),
  withPlayerStatisticsFeature(),
  withComputed(({ players, initialValue, game, initLoading, mode }) => ({
    storeLoaded: computed(
      () =>
        !initLoading() &&
        [EnumGameMode.Create, EnumGameMode.Edit].includes(mode()),
    ),
    // Players
    captains: computed(() =>
      players().filter(({ isCaptain }) => Boolean(isCaptain)),
    ),
    playersNew: computed(() => {
      console.log('PLAYERS WERE CHANGED');
      return players();
    }),
    isFormChanged: computed(() => {
      if (!initialValue()) {
        return false;
      }
      return !isEqual(initialValue(), game());
    }),
  })),

  withMethods(
    (
      store,
      { activatedRoute, gameService, playersService, teamsService } = {
        activatedRoute: inject(ActivatedRoute),
        gameService: inject(GameService),
        playersService: inject(PlayersService),
        teamsService: inject(TeamsService),
      },
    ) => ({
      // Game
      updateStatus: (status: EnumGameStatus): void => {
        patchState(store, state => ({
          game: { ...state.game, status },
        }));
      },
      initGame: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true, initLoading: true })),
          delay(500),
          switchMap(() =>
            forkJoin({
              paramMap: activatedRoute.paramMap.pipe(first()),
              teams: teamsService.findMock(),
              // .pipe(
              //   map(teams => {
              //     return Object.fromEntries(
              //       teams.map((team, index) => {
              //         return [index, team];
              //       }),
              //     );
              //   }),
              // ),
            }),
          ),
          switchMap<
            { paramMap: ParamMap; teams: [ITeamDTO, ITeamDTO] },
            Observable<any>
          >(({ paramMap, teams }) => {
            const gameId = paramMap.get('id');

            // Create
            if (!gameId) {
              return activatedRoute.queryParamMap.pipe(
                map(queryParam => {
                  const game = cloneDeep(INITIAL_GAME_STATE);
                  game.teams = teams;

                  if (queryParam.has('number')) {
                    game.number = Number(queryParam.get('number'));
                  }

                  if (queryParam.has('season')) {
                    game.season = Number(queryParam.get('season'));
                  }

                  if (
                    queryParam.has('playedAt') &&
                    queryParam.get('playedAt') &&
                    isDate(new Date(queryParam.get('playedAt')!))
                  ) {
                    game.playedAt = new Date(queryParam.get('playedAt')!);
                  }

                  // Should be last
                  patchState(
                    store,
                    () => ({
                      mode: EnumGameMode.Create,
                      game,
                    }),
                    state => ({ initialValue: cloneDeep(state.game) }),
                  );

                  // TODO
                  // Return statistics
                  // Would be nice, if we use that statistics inside
                  return [];
                }),
              );
            }

            // Edit
            if (gameId) {
              return gameService.findByIdMock(gameId).pipe(
                tap(game => {
                  if (!game) {
                    return;
                  }

                  console.log('EDIT', game);

                  // Fill in Game store
                  patchState(
                    store,
                    () => ({
                      mode: EnumGameMode.Edit,
                      game: {
                        ...game,
                        playedAt: new Date(game.playedAt),
                      },

                      teams: cloneDeep(teams),
                    }),
                    state => ({ initialValue: cloneDeep(state.game) }),
                  );
                }),
                map(game => game?.statistics ?? []),
              );
            }

            patchState(store, () => ({
              mode: EnumGameMode.Unknown,
            }));

            throw Error('Store has invalid settings');
          }),
          switchMap(statistics => {
            console.log('playerStatistics', statistics);

            return playersService.find().pipe(
              tap(players => {
                patchState(store, {
                  players: [...players],
                });

                // TODO
                (statistics as TPlayerStatisticFinal[]).forEach(
                  (element, index) => {
                    const found = players.find(
                      player => player.id === element.playerId,
                    );

                    if (found) {
                      console.log(found);
                      (statistics as TPlayerStatisticFinal[])[index] = {
                        ...found,
                        ...element,
                      };
                    }
                  },
                );

                // TODO type annotation
                store.setEntityPlayers(players);
                store.setEntityStatistics(statistics);
              }),

              catchError(error => {
                console.error('GameStore Crashed with error:', error);
                return EMPTY;
              }),
              finalize(() => {
                console.log('FINALIZE: INIT GAME', {
                  loading: false,
                  initLoading: false,
                });
                patchState(store, { loading: false, initLoading: false });
              }),
            );
          }),
        ),
      ),
    }),
  ),
  // Should be latest to read methods
  withHooks({
    onInit({ initGame }) {
      console.log(FEATURE_INITIALIZED);
      initGame();
    },
    onDestroy() {
      console.log(FEATURE_DESTROYED);
    },
  }),
);
