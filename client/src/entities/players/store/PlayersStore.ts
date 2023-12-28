import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { TPlayer } from '../types';
import { Injectable, OnInit } from '@angular/core';
import { getPlayersListMock } from '../api/get-players';
import { Observable } from 'rxjs';
import { TChosenPlayer } from '../types/index';
import { TeamEnum } from '@shared/constants/team';

export interface PlayersState {
  players: TPlayer[];
  selected: TChosenPlayer[];
}

const INITIAL_PLAYERS_STATE: PlayersState = {
  players: [],
  selected: [],
};

@Injectable()
export class PlayersStore
  extends ComponentStore<PlayersState>
  implements OnStoreInit
{
  readonly players$ = this.select(({ players }) => players);
  readonly selected$ = this.select(({ selected }) => selected);
  readonly playersTeamsA$ = this.select(({ selected }) =>
    selected.filter((select) => select.team === TeamEnum.TeamA)
  );
  readonly playersTeamsB$ = this.select(({ selected }) =>
    selected.filter((select) => select.team === TeamEnum.TeamB)
  );

  constructor() {
    super(INITIAL_PLAYERS_STATE);
  }

  async ngrxOnStoreInit(): Promise<void> {
    const players = await getPlayersListMock();
    this.setState((state) => ({ ...state, players }));
  }

  // readonly add = this.updater((state, player: TPlayer) => ({
  //   players: [...state.players, player],
  // }));

  // readonly delete = this.updater((state, id: string) => ({
  //   players: state.players.filter((player) => player.id !== id),
  // }));

  readonly deleteSelected = this.updater((state, id: string) => {
    return {
      ...state,
      selected: state.selected.filter((select) => select.id !== id),
    };
  });

  readonly addSelected = this.updater(
    (state, { id, team }: { id: string; team: TeamEnum }) => {
      const finded = state.players.find((player) => player.id === id);
      if (!finded) {
        return state;
      }

      // const selected = state.selected.filter(
      //   (selected) => selected.team !== team
      // );

      console.log('addSelected', { id, team });

      return {
        ...state,
        selected: [{ ...finded, team }, ...state.selected],
      };
    }
  );

  // TODO change to effects
  readonly setAsCaptain = this.updater((state, id: string) => ({
    ...state,
    captains: state.players.map((players) => {
      if (players.id === id) {
        return {
          ...players,
          isCaptain: true,
        };
      }
      return players;
    }),
  }));
}
