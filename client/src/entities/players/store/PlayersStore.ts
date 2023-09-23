import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { TPlayer } from '../types';
import { Injectable, OnInit } from '@angular/core';
import { getPlayersListMock } from '../api/get-players';
import { Observable } from 'rxjs';

export interface PlayersState {
  players: TPlayer[];
}

const INITIAL_PLAYERS_STATE: PlayersState = {
  players: [],
};

@Injectable()
export class PlayersStore
  extends ComponentStore<PlayersState>
  implements OnStoreInit
{
  readonly players$ = this.select(({ players }) => players);

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
}
