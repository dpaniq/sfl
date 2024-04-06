import { computed, inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PlayersService } from '@entities/players/services/players.service';
import { ITeam, TeamsService } from '@entities/teams';
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
import { cloneDeep, isEqual } from 'lodash';
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
import { TPlayer } from '../../players/types/index';
import { EnumGameMode, EnumGameStatus } from '../constants';
import { GameService } from '../services/game.service';
import { IGame, IPlayerStatistic } from '../types';

export type GameTeam = { id: string; name: TeamEnum; disable: boolean };

/**
 * TODO:
 * isCaptain needed only for Tplayer... Must be imporved with types
 *
 * TODO:
 * GamePlayer has bad naming, Must be improved
 *
 * Omit teamId from IPlayerStatistic to allow other players to be not selected
 */
export type GamePlayer = TPlayer & {
  transferable: boolean;
  disableAsPlayer: boolean;
  disableAsCaptain: boolean;

  // Rewrite types
  teamId: string | null;
};

export type PlayerStatisticNumberKeys = keyof Pick<
  IPlayerStatistic,
  'pass' | 'goal' | 'goalHead' | 'autoGoal' | 'penalty'
>;

export interface NewGameState {
  game: IGame;

  // Needed to keep all players with specific state
  players: GamePlayer[]; // TODO Cut

  // For internal process
  loading: boolean;
  initLoading: boolean;
  initialValue: null | IGame;
  mode: EnumGameMode;
  errors: [];
}

const INITIAL_GAME_STATE: IGame = {
  id: undefined,
  number: 0,
  season: 0,
  teams: {},
  playedAt: new Date(),
  statistics: [],
  status: EnumGameStatus.New,
};

const DEFAULT_STATISTIC_VALUES: Pick<
  IPlayerStatistic,
  PlayerStatisticNumberKeys | 'mvp'
> = {
  autoGoal: 0,
  goal: 0,
  goalHead: 0,
  pass: 0,
  penalty: 0,
  mvp: false,
};

const INITIAL_NEW_GAME_STATE: NewGameState = {
  game: INITIAL_GAME_STATE,
  players: [],

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
          delay(2500),
          switchMap(() =>
            forkJoin({
              paramMap: activatedRoute.paramMap.pipe(first()),
              teams: teamsService.find().pipe(
                map(teams => {
                  return Object.fromEntries(
                    teams.map((team, index) => {
                      return [index, team];
                    }),
                  );
                }),
              ),
            }),
          ),
          switchMap<
            { paramMap: ParamMap; teams: Record<string, ITeam> },
            Observable<IPlayerStatistic[]>
          >(({ paramMap, teams }) => {
            const gameId = paramMap.get('id');

            // Create
            if (!gameId) {
              return activatedRoute.queryParamMap.pipe(
                map(queryParam => {
                  const game = INITIAL_GAME_STATE;

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
              return gameService.find({ id: gameId }).pipe(
                map(games => games.at(0)),
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
                      game: { ...game, playedAt: new Date(game.playedAt) },
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
          switchMap(playerStatistics => {
            console.log('playerStatistics', playerStatistics);
            return playersService.getPlayers().pipe(
              tap(players => {
                console.log(
                  'players',
                  players,
                  typeof players,
                  Array.isArray(players),
                );

                // Merge game players statistics and players
                const mergedPlayers: GamePlayer[] = players.map(player => {
                  const found = playerStatistics.find(
                    ({ playerId }) => playerId === player.id,
                  );

                  if (!found) {
                    return {
                      ...player,
                      // additional
                      teamId: null,
                      disableAsPlayer: false,
                      disableAsCaptain: false,
                      transferable: false,
                    };
                  }

                  return {
                    ...player,
                    teamId: found.teamId ?? null,
                    disableAsPlayer: !!found.teamId,
                    disableAsCaptain: !!found.isCaptain,
                    transferable: false,
                  };
                });

                patchState(store, state => {
                  console.log('reset PLAYERS', state.players);
                  return {
                    players: mergedPlayers,
                  };
                });
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
      // Teams
      updateTeams: (teams: ITeam[]): void => {
        patchState(store, state => ({
          game: {
            ...state.game,
            teams: Object.fromEntries(
              teams.map((team, index) => {
                return [index, team];
              }),
            ),
          },
        }));
      },

      // Captains
      updateCaptain(captainToUpdate: GamePlayer): void {
        patchState(
          store,

          state => {
            // Update captain player
            const players: GamePlayer[] = state.players.map(player => {
              if (player.id === captainToUpdate.id) {
                return captainToUpdate;
              }
              return player;
            });

            /**
             * Fill in statistics
             *
             * If captainToUpdate (updated player) has team
             *
             * + (has team) -> remove player from statistics
             * - (has not team) -> add player to statistics
             */
            const game = state.game;
            game.statistics = !captainToUpdate.teamId
              ? state.game.statistics.filter(
                  stat => stat.playerId !== captainToUpdate.id,
                )
              : [
                  ...state.game.statistics,
                  {
                    playerId: captainToUpdate.id!,
                    teamId: captainToUpdate.teamId!,
                    isCaptain: captainToUpdate.disableAsCaptain,
                    ...DEFAULT_STATISTIC_VALUES,
                  },
                ];

            return {
              players,
              game,
            };
          },
        );
      },

      // Players
      setPlayers(teamId: string | null, addedPlayers: GamePlayer[]): void {
        // Set added players
        patchState(store, state => {
          /**
           * Update players
           *
           * Check player exists in added players
           *
           * Player exist in added players set:
           *  + update player with team and set disable (selected) true
           *  - skip player
           *
           * TODO: make it readable
           */
          const players = state.players.map(player => {
            // An
            if (player.teamId && player.teamId !== teamId) {
              // Player already belongs to another team
              return player;
            }

            if (player.transferable) {
              // Transferable player, skip it
              return player;
            }

            // Player exists in added players set, update it
            const addedPlayer = addedPlayers.find(
              added => added.id === player.id,
            );
            if (addedPlayer) {
              return { ...player, disableAsPlayer: true, teamId };
            }

            // Player not exists in added players set, reset it
            return {
              ...player,
              disableAsPlayer: false,
              teamId: null,
            };
          });

          const game = { ...state.game };
          const statisticIds = game.statistics.map(stat => stat.playerId);

          // Add comment to block below

          /**
           *  Add new players to game.statistics
           *
           * Filter players with teamId (has team) and statisticIds does not includes player.id (not exists in statistics)
           */
          const newPlayersToAdd: IPlayerStatistic[] = players
            .filter(({ id, teamId }) => !!teamId && !statisticIds.includes(id))
            .map(player => {
              return {
                playerId: player.id,
                teamId: player.teamId!,
                isCaptain: player.disableAsCaptain,
                ...DEFAULT_STATISTIC_VALUES,
              };
            });

          game.statistics = [...game.statistics, ...newPlayersToAdd];

          return {
            // Reset all player belonging to current team
            game,
            players,
          };
        });
      },
      togglePlayerMVP: ({
        player: { playerId, teamId },
        mvp,
      }: {
        player: IPlayerStatistic;
        mvp: boolean;
      }): void => {
        patchState(store, state => {
          const game = { ...state.game };
          game.statistics = state.game.statistics.map(stat => {
            if (stat.playerId === playerId && stat.teamId === teamId) {
              stat.mvp = mvp;
              return stat;
            }
            return stat;
          });

          return {
            game,
          };
        });
      },
      patchPlayerStats: ({
        player: { playerId, teamId },
        action,
        key,
      }: {
        player: IPlayerStatistic;
        action: 'decrement' | 'increment';
        key: PlayerStatisticNumberKeys;
      }): void => {
        patchState(store, state => {
          const game = { ...state.game };
          game.statistics = state.game.statistics.map(stat => {
            if (stat.playerId === playerId && stat.teamId === teamId) {
              if (action === 'decrement') {
                key;
                stat[key] -= 1;
              } else {
                stat[key] += 1;
              }
              return stat;
            }
            return stat;
          });

          return {
            game,
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

      // Games
    }),
  ),
  // Should be latest to read methods
  withHooks({
    onInit({ initGame }) {
      console.info('new game store 2 initialization...');
      initGame();
    },
    onDestroy({ players }) {
      console.info('players on destroy', players());
    },
  }),
);
