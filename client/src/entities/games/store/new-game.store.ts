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
import { EntityId } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TeamEnum } from '@shared/constants/team';
import { isDate } from 'date-fns';
import { cloneDeep, isEqual } from 'lodash-es';
import {
  NEVER,
  Observable,
  catchError,
  delay,
  finalize,
  first,
  forkJoin,
  of,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { EnumGameMode, EnumGameStatus } from '../constants';
import { GameService } from '../services/game.service';
import {
  IPlayerDTO,
  IPlayerStatisticDTO,
  ITeamDTO,
  TGameFinal,
  TPlayerFinal,
  TPlayerStatisticFinal,
  TTeamFinal,
} from '../types';
import { withPlayersFeature } from './players.feature';
import {
  generatePlayerStatisticID,
  withPlayerStatisticsFeature,
} from './statistics.feature';
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
  createdAt: undefined,
  updatedAt: undefined,
  statistics: [],
  status: EnumGameStatus.New,
};

const INITIAL_NEW_GAME_STATE: NewGameState = {
  game: INITIAL_GAME_STATE,
  players: [],

  // One level game fields
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

function isNewGameChanged({
  initialStatisticsIds,
  actualStatisticsIds,
}: {
  initialStatisticsIds: EntityId[];
  actualStatisticsIds: EntityId[];
}): boolean {
  // TODO: Wrong way
  // We need compare statistics either
  const isStatisticChanged = !isEqual(
    initialStatisticsIds,
    actualStatisticsIds,
  );

  console.log('isNewGameChanged', {
    initialStatisticsIds,
    actualStatisticsIds,
    result: isStatisticChanged,
  });

  return isStatisticChanged;
}

function mergeStatisticsAndPlayers({
  players,
  statistics,
}: {
  statistics: IPlayerStatisticDTO[];
  players: TPlayerFinal[];
}): (IPlayerStatisticDTO & IPlayerDTO)[] {
  const mappedStatistics = statistics.map(element => {
    const found = players.find(player => player.id === element.playerId);
    if (found) {
      console.log(found);
      return {
        ...found,
        ...element,
      };
    }

    console.log('Not found player while "mergeStatisticsAndPlayers"', element);
    return undefined;
  });

  return mappedStatistics.filter(Boolean) as (IPlayerStatisticDTO &
    IPlayerDTO)[];
}

function initGameCreation(
  queryParam: ParamMap,
  { teams }: { teams: [ITeamDTO, ITeamDTO] },
): Observable<TGameFinal> {
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

  return of(game);
}

function initGameEdition(game?: TGameFinal): Observable<TGameFinal> {
  if (game) {
    return of({ ...game, playedAt: new Date(game.playedAt) });
  }

  return of(cloneDeep(INITIAL_GAME_STATE));
}

export const NewGameStore = signalStore(
  withState(INITIAL_NEW_GAME_STATE),
  withTeamsFeature(),
  withPlayersFeature(),
  withPlayerStatisticsFeature(),
  withComputed(
    ({ players, initialValue, game, initLoading, mode, statisticsIds }) => {
      return {
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
          if (!initialValue() || initLoading()) {
            return false;
          }

          return isNewGameChanged({
            initialStatisticsIds: (initialValue()?.statistics ?? []).map(
              generatePlayerStatisticID,
            ),
            actualStatisticsIds: statisticsIds(),
          });

          return !isEqual(initialValue(), game());
        }),
      };
    },
  ),

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
              teams: teamsService.find(),
              players: playersService.find(),
            }),
          ),
          switchMap<
            {
              paramMap: ParamMap;
              teams: [ITeamDTO, ITeamDTO];
              players: TPlayerFinal[];
            },
            Observable<TGameFinal>
          >(({ paramMap, teams, players }) => {
            const gameId = paramMap.get('id');
            const mode = gameId ? EnumGameMode.Edit : EnumGameMode.Create;

            // Switch mode + cases
            const gameObservable: Observable<TGameFinal> = !gameId
              ? // Inititialize and prepared data for creation mode
                initGameCreation(paramMap, { teams })
              : // Load & prepared data for editing game
                gameService
                  .findById(gameId)
                  .pipe(switchMap(game => initGameEdition(game)));

            // Update state
            return gameObservable.pipe(
              tap((game: TGameFinal) => {
                patchState(store, () => ({
                  mode,
                  game,
                  players: cloneDeep(players),
                  teams: cloneDeep(teams),
                  initialValue: cloneDeep(game),
                  loading: false,
                  initLoading: true,
                }));

                const stats = mergeStatisticsAndPlayers({
                  players,
                  statistics: game.statistics,
                });

                store.initTeamsEntity(teams);
                store.initEntityPlayers(players);
                store.initEntityStatistics(stats);
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
          catchError((error: any, caught) => {
            console.error('GameStore Crashed with error:', error, caught);

            patchState(store, {
              loading: false,
              mode: EnumGameMode.Unknown,
            });

            return NEVER;
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
