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
import { cloneDeep, isEqual, omit } from 'lodash-es';
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
  IGameDTO,
  IPlayerStatisticDTO,
  IPlayerStatisticSettings,
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
  initialGame,
  actualGame,
  actualTeams,
  actualStatistics,
}: {
  initialGame: TGameFinal;
  actualGame: TGameFinal;
  actualTeams: TTeamFinal[];
  actualStatistics: TPlayerStatisticFinal[];
}): boolean {
  const result = false;

  // Game
  if (!isEqual(initialGame.id, actualGame.id)) {
    console.log('id changed');
    return true;
  }

  if (!isEqual(initialGame.number, actualGame.number)) {
    console.log('number changed');
    return true;
  }

  if (!isEqual(initialGame.season, actualGame.season)) {
    console.log('season changed');
    return true;
  }

  if (!isEqual(initialGame.playedAt, actualGame.playedAt)) {
    console.log('playedAt changed');
    return true;
  }

  if (!isEqual(initialGame.status, actualGame.status)) {
    console.log('status changed');
    return true;
  }

  // Teams
  const initialTeamId = initialGame.teams.at(0)!.id;
  const actualTeamId = actualTeams.at(0)!.id;
  if (initialTeamId !== actualTeamId) {
    return true;
  }

  // Statistics
  const initialStatistics: IPlayerStatisticDTO[] = initialGame.statistics;
  const actualStatisticsDto: IPlayerStatisticDTO[] = actualStatistics.map(
    stats => omit(stats, 'id', 'playerData'),
  );

  if (actualStatisticsDto.length !== initialStatistics.length) {
    return true;
  }

  for (const actual of actualStatisticsDto) {
    let initial: any;
    initial = initialStatistics.find(
      stats =>
        stats.playerId === actual.playerId && stats.teamId === actual.teamId,
    );

    // TODO isTransferable
    initial = { ...initial, isTransferable: false };

    const compareLog = (at: string) => {
      console.log({
        at,
        initial,
        actual,
      });
    };

    if (!initial) {
      return true;
    }

    if (initial.goal !== actual.goal) {
      compareLog('goal');
      return true;
    }

    if (initial.goalHead !== actual.goalHead) {
      compareLog('goalHead');
      return true;
    }

    if (initial.penalty !== actual.penalty) {
      compareLog('penalty');
      return true;
    }

    if (initial.pass !== actual.pass) {
      compareLog('pass');
      return true;
    }

    // TODO: FIX backend (db)
    // if (initial.isMVP !== actual.isMVP) {
    //   compareLog('isMVP');
    //   return true;
    // }

    if (initial.isCaptain !== actual.isCaptain) {
      compareLog('isCaptain');
      return true;
    }

    if (initial.isTransferable !== actual.isTransferable) {
      compareLog('isTransferable');
      return true;
    }
  }

  return false;
}

function matchStatisticsPlayerData({
  players,
  statistics,
}: {
  statistics: TPlayerStatisticFinal[];
  players: TPlayerFinal[];
}): TPlayerStatisticFinal[] {
  const mappedStatistics = statistics.map(element => {
    const data = players.find(player => player.id === element.playerId);
    if (!data) {
      console.log(
        'Not found player while "mergeStatisticsAndPlayers"',
        element,
      );
      return undefined;
    }

    element.playerData = data;

    return element;
  });

  return mappedStatistics.filter(Boolean) as TPlayerStatisticFinal[];
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
    ({
      players,
      initialValue,
      game,
      initLoading,
      mode,
      statisticsEntities,
      teamsEntities,
      teams,
    }) => {
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

          console.log('isFormChanged', {
            teamsEntities: teamsEntities(),
            teams: teams(),
          });

          return isNewGameChanged({
            initialGame: initialValue() as TGameFinal,
            actualGame: game(),
            actualTeams: teamsEntities(),
            actualStatistics: statisticsEntities(),
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
      updateGame() {
        const { id, status, number, season, playedAt } =
          store.game() as IGameDTO;

        const gameDTO = <IGameDTO>{
          id,
          status,
          number,
          season,
          playedAt,
          teams: store.teamsEntities(),
          statistics: store.statisticsEntities().map(stats => {
            return omit<TPlayerStatisticFinal, keyof IPlayerStatisticSettings>(
              stats,
              'id',
              'playerData',
            );
          }),
        };

        console.log(gameDTO);

        // TODO
        gameService.resave(id, gameDTO).subscribe(game => {
          console.log('GAME IS UPDATED', game);
          if (!game) {
            console.log('GAME IS NOT UPDATED');
            return;
          }

          patchState(store, { initialValue: game });
          this.initGame();
        });
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

                const stats = matchStatisticsPlayerData({
                  players,
                  statistics: game.statistics as TPlayerStatisticFinal[],
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
