import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { Injectable, inject } from '@angular/core';
import { TChosenPlayer, TPlayer } from '../types';
import { TeamEnum } from '@shared/constants/team';
import { PlayersService } from '../services/players.service';

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
  private playersService = inject(PlayersService);

  readonly players$ = this.select(({ players }) => players);
  readonly selected$ = this.select(({ selected }) => selected);
  readonly playersTeamsA$ = this.select(({ selected }) =>
    selected.filter(select => select.team === TeamEnum.teamA),
  );
  readonly playersTeamsB$ = this.select(({ selected }) =>
    selected.filter(select => select.team === TeamEnum.teamB),
  );

  constructor() {
    super(INITIAL_PLAYERS_STATE);
  }

  async ngrxOnStoreInit(): Promise<void> {
    const players = (await this.playersService.getList()).players ?? [];
    this.setState(state => ({ ...state, players }));
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
      selected: state.selected.filter(select => select.id !== id),
    };
  });

  // readonly addSelected = this.updater((state, { id, team }: any) => {
  //   const finded = state.players.find(player => player.id === id);
  //   if (!finded) {
  //     return state;
  //   }

  //   // const selected = state.selected.filter(
  //   //   (selected) => selected.team !== team
  //   // );

  //   console.log('addSelected', { id, team });

  //   return {
  //     ...state,
  //     selected: [{ ...finded, team }, ...state.selected],
  //   };
  // });

  // TODO change to effects
  private readonly toggleCaptain = this.updater(
    (state, { id, isCaptain }: TPlayer) => ({
      ...state,
      players: state.players.map(player => {
        if (player.id !== id) {
          return player;
        }

        console.log('Update player', id, isCaptain);
        return {
          ...player,
          isCaptain,
        };
      }),
    }),
  );

  // Try Catch (todo: move to effects)
  async tryToggleCaptain(player: TPlayer) {
    try {
      if (await this.playersService.patch(player)) {
        this.toggleCaptain(player);
      }
    } catch (error) {
      console.log('OOOOH MY, not pormoted', player.id);
    }
  }
}
