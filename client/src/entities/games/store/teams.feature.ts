import {
  patchState,
  signalStoreFeature,
  type,
  withMethods,
} from '@ngrx/signals';
import { TTeamFinal } from '../types';
import { NewGameState } from './new-game.store';

export function withTeamsFeature<_>() {
  return signalStoreFeature(
    {
      state: type<NewGameState>(),
    },
    withMethods(store => ({
      updateTeams(teams: [TTeamFinal, TTeamFinal]): void {
        patchState(store, { teams });
      },
    })),
  );
}
