import {
  patchState,
  signalStoreFeature,
  type,
  withHooks,
  withMethods,
} from '@ngrx/signals';
import {
  addEntity,
  entityConfig,
  setAllEntities,
  withEntities,
} from '@ngrx/signals/entities';
import { IPlayerDTO, TPlayerFinal } from '../types';
import { NewGameState } from './new-game.store';

const PLAYERS_ENTITY_CONFIG = entityConfig({
  entity: type<TPlayerFinal>(),
  collection: 'players',
  selectId: player => player.id,
});

const FEATURE_NAME = 'PLAYERS';

const FEATURE_INITIALIZED = `[${FEATURE_NAME} STORE FEATURE] has been initialized 🚀`;

const FEATURE_DESTROYED = `[${FEATURE_NAME} STORE FEATURE] destroyed 💥`;

export function withPlayersFeature<_>() {
  return signalStoreFeature(
    {
      state: type<NewGameState>(),
    },
    withEntities(PLAYERS_ENTITY_CONFIG),
    withMethods(store => ({
      addPlayer(player: IPlayerDTO): void {
        patchState(store, addEntity(player, PLAYERS_ENTITY_CONFIG));
      },
      setEntityPlayers(players: TPlayerFinal[]): void {
        patchState(
          store,
          setAllEntities(
            players.map(player => ({
              ...player,
            })),
            PLAYERS_ENTITY_CONFIG,
          ),
        );
      },
    })),
    withHooks({
      onInit() {
        console.log(FEATURE_INITIALIZED);
      },
      onDestroy() {
        console.log(FEATURE_DESTROYED);
      },
    }),
  );
}
