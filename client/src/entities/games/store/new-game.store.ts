import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { Injectable, OnInit, inject } from '@angular/core';
import { TeamEnum } from '@shared/constants/team';
import { TChosenPlayer, TPlayer } from '@entities/players';
import { PlayersService } from '@entities/players/services/players.service';

export type GameTeam = { name: TeamEnum; disable: boolean };
export type GamePlayer = Omit<TPlayer, 'team'> & {
  team: TeamEnum | null;
  disable: boolean;
};

export interface NewGameState {
  teams: GameTeam[];
  players: GamePlayer[];
}

const INITIAL_PLAYERS_STATE: NewGameState = {
  players: [],
  teams: [
    { name: TeamEnum.teamA, disable: false },
    { name: TeamEnum.teamB, disable: false },
  ],
};

@Injectable()
export class NewGameStore
  extends ComponentStore<NewGameState>
  implements OnStoreInit
{
  private playersService = inject(PlayersService);

  readonly players$ = this.select(({ players }) => players);

  readonly captains$ = this.select(({ players }) =>
    players.filter((player) => player.isCaptain)
  );

  readonly teams$ = this.select(({ teams }) => teams);

  constructor() {
    super(INITIAL_PLAYERS_STATE);
  }

  async ngrxOnStoreInit(): Promise<void> {
    const players = (await this.playersService.getList()).players ?? [];

    this.setState((state) => ({
      ...state,
      players: players.map((player) => ({
        ...player,
        team: null,
        disable: false,
      })),
    }));
  }

  readonly patchPlayers = this.updater((state, players: GamePlayer[]) => {
    console.log('patchPlayers', players);
    return {
      ...state,
      players,
      // players: state.players.map((player) => {
      //   const found = players.find(({ id }) => id === player.id);
      //   if (found) {
      //     console.log('patchPlayer wtih', { ...player, ...found });
      //   }
      //   return { ...player, ...found };
      // }),
    };
  });

  readonly patchTeam = this.updater((state, { name, disable }: GameTeam) => {
    console.log('inside patch team', name, disable);
    if (!name) {
      return state;
    }

    console.log('will changed team');

    return {
      ...state,
      teams: state.teams.map((team) => {
        if (team.name !== name) {
          return team;
        }
        return { name, disable };
      }),
    };
  });
}
