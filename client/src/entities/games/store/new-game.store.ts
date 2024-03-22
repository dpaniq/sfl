import { TPlayer } from '../../players/types/index';
// TODO REMOVE AS DEP
import { computed, inject } from '@angular/core';
import { TeamEnum } from '@shared/constants/team';
import { PlayersService } from '@entities/players/services/players.service';
import {
  EMPTY,
  Observable,
  catchError,
  concatMap,
  delay,
  finalize,
  map,
  of,
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
import { ActivatedRoute, Params } from '@angular/router';
import { GameService } from '../services/game.service';
import { IPlayerStatistic } from '../types';

export type GameTeam = { id: string; name: TeamEnum; disable: boolean };

export type GamePlayerInternalProcessProps = {
  transferable: boolean;
  disableAsPlayer: boolean;
  disableAsCaptain: boolean;

  // Rewrite types
  teamId: string | null;
};

/**
 * TODO:
 * isCaptain needed only for Tplayer... Must be imporved with types
 *
 * TODO:
 * GamePlayer has bad naming, Must be improved
 *
 * Omit teamId from IPlayerStatistic to allow other players to be not selected
 */
export type GamePlayer = TPlayer &
  Omit<IPlayerStatistic, 'teamId'> &
  GamePlayerInternalProcessProps;

export type PlayerStatisticNumberKeys = keyof Pick<
  IPlayerStatistic,
  'pass' | 'goal' | 'goalHead' | 'autoGoal' | 'penalty'
>;

export interface NewGameState {
  status: any;
  loading: boolean;
  // teams: GameTeam[];
  players: GamePlayer[];
  mode: NewGameMode;
}

export enum NewGameMode {
  Create = 'create',
  Edit = 'edit',
  Unknown = 'unknown',
}

const INITIAL_PLAYERS_STATE: NewGameState = {
  status: '',
  loading: false,
  players: [],
  mode: NewGameMode.Unknown,
  // teams: [
  //   { id: '65f951d0e78734c2150ef003', name: TeamEnum.teamA, disable: false },
  //   { id: '65f951dee78734c2150ef007', name: TeamEnum.teamB, disable: false },
  // ],
};

// Read https://offering.solutions/blog/articles/2023/12/03/ngrx-signal-store-getting-started/

export const NewGameStore = signalStore(
  withState(INITIAL_PLAYERS_STATE),

  withComputed(({ /*teams,*/ players }) => ({
    // Teams
    // teamsAreDisabled: computed(() => teams().every(team => team.disable)),
    // Players
    captains: computed(() =>
      players().filter(({ isCaptain }) => Boolean(isCaptain)),
    ),
  })),
  withMethods(
    (
      store,
      { router, gameService, playersService } = {
        router: inject(ActivatedRoute),
        gameService: inject(GameService),
        playersService: inject(PlayersService),
      },
    ) => ({
      // init: rxMethod<void>(pipe()),
      // TODO get teams
      // initTeams: rxMethod<void>(
      //   pipe(
      //     tap(() => {
      //       patchState(store, { loading: true });
      //     }),
      //     delay(2500),
      //     switchMap(() =>
      //       playersService.getPlayers().pipe(
      //         tap(players => {
      //           console.log(
      //             'players',
      //             players,
      //             typeof players,
      //             Array.isArray(players),
      //           );

      //           patchState(store, {
      //             players: players.map(player => ({
      //               ...player,
      //               pass: 0,
      //               goal: 0,
      //               goalHead: 0,
      //               autoGoal: 0,

      //               // additional
      //               team: null,
      //               disableAsPlayer: false,
      //               disableAsCaptain: false,
      //               transferable: false,
      //             })),
      //           });
      //         }),

      //         catchError(error => {
      //           console.error('GameStore Crashed with error:', error);
      //           return EMPTY;
      //         }),
      //         finalize(() => {
      //           patchState(store, { loading: false });
      //         }),
      //       ),
      //     ),
      //   ),
      // ),
      initGame: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(store, { loading: true });
          }),
          delay(2500),
          concatMap(() => router.params),
          switchMap<Params, Observable<IPlayerStatistic[]>>(({ id }) => {
            console.log({ id });

            if (id) {
              patchState(store, () => ({
                mode: NewGameMode.Edit,
              }));

              return gameService
                .find({ id: id })
                .pipe(map(games => games.at(0)?.statistics ?? []));
            }

            patchState(store, () => ({
              mode: NewGameMode.Create,
            }));
            return of([]);
          }),
          switchMap(playerStatistics => {
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

                      pass: 0,
                      goal: 0,
                      goalHead: 0,
                      autoGoal: 0,
                      penalty: 0,
                      mvp: false,

                      // additional
                      playerId: player.id,
                      teamId: null,
                      disableAsPlayer: false,
                      disableAsCaptain: false,
                      transferable: false,
                    };
                  }

                  console.log(found);

                  return {
                    ...found,
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

                // patchState(store, state => ({
                //   players: players.map(player => {
                //     return {
                //       ...player,

                //       pass: 0,
                //       goal: 0,
                //       goalHead: 0,
                //       autoGoal: 0,
                //       penalty: 0,
                //       mvp: false,

                //       // additional
                //       playerId: player.id,
                //       teamId: null,
                //       disableAsPlayer: false,
                //       disableAsCaptain: false,
                //       transferable: false,
                //     };
                //   }),
                // }));
              }),

              catchError(error => {
                console.error('GameStore Crashed with error:', error);
                return EMPTY;
              }),
              finalize(() => {
                patchState(store, { loading: false });
              }),
            );
          }),
        ),
      ),
      // // Teams REMOVE
      // updateTeam(teamToUpdate: GameTeam): void {
      //   patchState(store, state => {
      //     return {
      //       teams: state.teams.map(team => {
      //         if (team.name === teamToUpdate.name) {
      //           return teamToUpdate;
      //         }
      //         return team;
      //       }),
      //     };
      //   });
      // },

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
      // TODO switch these methods
      // resetPlayers(playerStatistics: IPlayerStatistic[]) {
      //   patchState(store, state => {
      //     console.log('reset PLAYERS', state.players);
      //     return {
      //       players: state.players.map(player => {
      //         const found = playerStatistics.find(
      //           ({ playerId }) => playerId === player.id,
      //         );

      //         console.log({ found });

      //         if (!found) {
      //           return player;
      //         }

      //         console.log(found);

      //         return {
      //           ...player,
      //           ...playerStatistics,
      //           disableAsPlayer: true,
      //           disableAsCaptain: true,
      //           transferable: false,
      //         };
      //       }),
      //     };
      //   });
      // },
      setPlayers(teamId: string | null, addedPlayers: GamePlayer[]): void {
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
                if (player.teamId && player.teamId !== teamId) {
                  return player;
                }

                if (player.transferable) {
                  return player;
                }

                return addedPlayers.find(added => added.id === player.id)
                  ? { ...player, disableAsPlayer: true, teamId }
                  : {
                      ...player,
                      disableAsPlayer: false,
                      teamId: null,
                    };
              }),
          };
        });
      },
      patchPlayerStats: ({
        player: { id, teamId },
        action,
        key,
      }: {
        player: GamePlayer;
        action: 'decrement' | 'increment';
        key: PlayerStatisticNumberKeys;
      }): void => {
        patchState(store, state => {
          return {
            players: state.players.map(player => {
              if (player.id === id && player.teamId === teamId) {
                if (action === 'decrement') {
                  key;
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
                  // team:
                  //   player.team!.name === TeamEnum.teamA
                  //     ? '65f951dee78734c2150ef007
                  //     : '65f951d0e78734c2150ef003',
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
    }),
  ),
  // Should be latest to read methods
  withHooks({
    onInit({ /*initTeams, */ initGame }) {
      console.info('new game store 2 initialization...');
      initGame();
      // initTeams(); // TODO
    },
    onDestroy({ players }) {
      console.info('players on destroy', players());
    },
  }),
);
