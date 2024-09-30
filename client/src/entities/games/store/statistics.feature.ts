import { computed } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withHooks,
  withMethods,
} from '@ngrx/signals';
import {
  addEntity,
  entityConfig,
  removeEntity,
  setAllEntities,
  updateEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { GamePlayerStatistic } from '../components/game-create-player-statistics/game-create-player-statistics.component';
import {
  IPlayerDTO,
  IPlayerStatisticDTO,
  TPlayerStatisticFinal,
  TPlayerStatisticFinalBoolean,
  TPlayerStatisticFinalBooleanKeys,
  TPlayerStatisticFinalIds,
  TPlayerStatisticFinalNumber,
  TPlayerStatisticFinalNumberKeys,
  TTeamFinal,
} from '../types';
import { NewGameState } from './new-game.store';

const STATISTIC_ENTITY_CONFIG = entityConfig({
  entity: type<TPlayerStatisticFinal>(),
  collection: 'statistics',
  selectId: statistic => statistic.id,
});

const FEATURE_NAME = 'PLAYER STATISTICS';

const FEATURE_INITIALIZED = `[${FEATURE_NAME} STORE FEATURE] has been initialized 🚀`;

const FEATURE_DESTROYED = `[${FEATURE_NAME} STORE FEATURE] destroyed 💥`;

export const DEFAULT_STATISTIC_IDS_VALUES: Partial<TPlayerStatisticFinalIds> = {
  playerId: undefined,
  teamId: undefined,
};

export const DEFAULT_STATISTIC_BOOLEAN_VALUES: TPlayerStatisticFinalBoolean = {
  isMVP: false,
  isCaptain: false,
  isTransferable: false,
};

export const DEFAULT_STATISTIC_NUMBER_VALUES: TPlayerStatisticFinalNumber = {
  autoGoal: 0,
  goal: 0,
  goalHead: 0,
  pass: 0,
  penalty: 0,
};

export const DEFAULT_STATISTIC_VALUES: Required<
  Pick<
    TPlayerStatisticFinal,
    TPlayerStatisticFinalNumberKeys | TPlayerStatisticFinalBooleanKeys
  >
> = {
  ...DEFAULT_STATISTIC_IDS_VALUES,
  ...DEFAULT_STATISTIC_BOOLEAN_VALUES,
  ...DEFAULT_STATISTIC_NUMBER_VALUES,
};

function getOppositeTeamId(
  teamId: string,
  teams: [TTeamFinal, TTeamFinal],
): string {
  return teamId === teams.at(0)?._id ? teams.at(1)!._id : teams.at(0)!._id;
}

export function generatePlayerStatisticID({
  teamId,
  playerId,
}: Pick<IPlayerStatisticDTO, 'teamId' | 'playerId'>): string {
  return `${teamId}~${playerId}`;
}

function mapStatisticDTOtoFinal(
  statistic: IPlayerStatisticDTO & IPlayerDTO,
): TPlayerStatisticFinal {
  return {
    ...statistic,
    id: generatePlayerStatisticID(statistic),
    isTransferable: false,
  };
}

export function withPlayerStatisticsFeature<_>() {
  return signalStoreFeature(
    {
      state: type<NewGameState>(),
    },
    withEntities(STATISTIC_ENTITY_CONFIG),
    withComputed(store => ({
      // TODO: need id
      statisticsBMW: computed(() => {
        console.log('statisticsBMW:', store.teams().at(0)?._id);
        console.log({
          wtf: store.statisticsEntities(),
        });
        return store
          .statisticsEntities()
          .filter(stat => stat.teamId === store.teams().at(0)?._id);
      }),
      // TODO: need id
      statisticsHONDA: computed(() => {
        console.log('statisticsHONDA:', store.teams().at(1)?._id);
        return store
          .statisticsEntities()
          .filter(stat => stat.teamId === store.teams().at(1)?._id);
      }),
    })),
    withMethods(store => ({
      toggleIsMVP({ id, teamId }: TPlayerStatisticFinal): void {
        console.group('toggleIsMVP', id, teamId);
        patchState(
          store,
          updateEntity(
            {
              id,
              changes: ({ isMVP }) => ({ isMVP: !isMVP }),
            },
            STATISTIC_ENTITY_CONFIG,
          ),
        );
        console.groupEnd();
      },
      toggleIsCaptain({ id, teamId }: GamePlayerStatistic): void {
        console.group('toggleIsCaptain');
        patchState(
          store,
          updateEntities(
            {
              predicate: statistic => statistic.teamId === teamId,
              changes: {
                isCaptain: false,
              },
            },
            STATISTIC_ENTITY_CONFIG,
          ),
          updateEntity(
            { id, changes: { isCaptain: true } },
            STATISTIC_ENTITY_CONFIG,
          ),
        );

        console.groupEnd();
      },

      // Here we get actual transferable state at once
      toggleTransferable(statistic: GamePlayerStatistic): void {
        console.group('toggleTransferable');
        const { id, teamId, playerId, isTransferable } = statistic;

        if (!isTransferable) {
          const statisticsWithThisPlayerIdLength = store
            .statisticsEntities()
            .filter(stat => stat.playerId === playerId).length;

          console.log({ statisticsWithThisPlayerIdLength });

          // Transferable false mean:
          switch (statisticsWithThisPlayerIdLength) {
            // If in statistics array only one player - set transferable false
            case 1:
              console.log('case 1');
              return patchState(
                store,
                updateEntity(
                  {
                    id: statistic.id,
                    changes: { isTransferable },
                  },
                  STATISTIC_ENTITY_CONFIG,
                ),
              );
            case 2:
              // If in statistics array only one player - remove current and set second transferable false
              console.log('case 2');
              return patchState(
                store,
                removeEntity(id, STATISTIC_ENTITY_CONFIG),
                updateEntities(
                  {
                    predicate: statistic => statistic.playerId === playerId,
                    changes: { isTransferable: false },
                  },
                  STATISTIC_ENTITY_CONFIG,
                ),
              );
            default:
              throw new Error(
                'Not implemented for statistics more than 2 players',
              );
          }
        }

        // Update current and add new one
        const teams = store.teams() as [TTeamFinal, TTeamFinal];
        const oppositeTeamId = getOppositeTeamId(teamId, teams);
        const oppositeId = generatePlayerStatisticID({
          teamId: oppositeTeamId,
          playerId,
        });

        patchState(
          store,
          updateEntity(
            {
              id,
              changes: { isTransferable },
            },
            STATISTIC_ENTITY_CONFIG,
          ),
          addEntity(
            {
              ...statistic,
              id: oppositeId,
              teamId: oppositeTeamId,
              isCaptain: false,
            },
            STATISTIC_ENTITY_CONFIG,
          ),
        );
        console.groupEnd();
      },

      patchNumberKeysStatistics({
        statistic,
        number,
        key,
      }: {
        statistic: GamePlayerStatistic;
        number: number;
        key: TPlayerStatisticFinalNumberKeys;
      }): void {
        console.group('patchPlayerStats');

        patchState(
          store,
          updateEntity(
            {
              id: statistic.id,
              changes: {
                [key]: statistic[key] + number,
              },
            },
            STATISTIC_ENTITY_CONFIG,
          ),
        );

        console.groupEnd();
      },
      addStatisticPlayer(statistic: TPlayerStatisticFinal): void {
        patchState(store, addEntity(statistic, STATISTIC_ENTITY_CONFIG));
      },
      removeStatisticPlayer(id: string) {
        patchState(store, removeEntity(id, STATISTIC_ENTITY_CONFIG));
      },
      setEntityStatistics(
        statisticsDto: (IPlayerStatisticDTO & IPlayerDTO)[],
      ): void {
        patchState(
          store,
          setAllEntities(
            statisticsDto.map(mapStatisticDTOtoFinal),
            STATISTIC_ENTITY_CONFIG,
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
