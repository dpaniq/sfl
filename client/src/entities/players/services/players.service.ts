import { Injectable, inject, isDevMode } from '@angular/core';
import { IPlayerDTO, TPlayerFinal } from '@entities/games/types';
import { HttpService } from '@shared/services/http.service';
import { Observable, firstValueFrom, of } from 'rxjs';
import { PlayerClient } from '../types';
import { playersMock } from './players.mock';

type ResponseCaptains = {
  players: PlayerClient[];
  page: number;
};

export type PlayersResponse = {
  players: PlayerClient[];
  page: number;
};

@Injectable()
export class PlayersService {
  #httpService = inject(HttpService);

  find(): Observable<TPlayerFinal[]> {
    if (false && isDevMode()) {
      of(playersMock);
    }

    return this.#httpService.get<TPlayerFinal[]>('players');
  }

  create(player: {
    email: string;
    nickname: string;
    name?: string;
    surname?: string;
  }): Observable<IPlayerDTO[]> {
    return this.#httpService.post<
      SetOptional<IPlayerDTO, 'id' | 'isCaptain'>[],
      IPlayerDTO[]
    >('players', [player]);
  }

  getCaptainsPlayers(): Observable<PlayerClient[]> {
    return this.#httpService.get<PlayerClient[]>('players/captains');
  }

  async getList(page: number = 0): Promise<ResponseCaptains> {
    const data = await firstValueFrom(
      this.#httpService.post<ResponseCaptains>('players/list', { page }),
    );

    return {
      players: data?.players ?? [],
      page: data.page ?? 0,
    };
  }

  patch(
    id: string,
    partialPlayer: Partial<PlayerClient>,
  ): Observable<PlayerClient | null> {
    return this.#httpService.patch<Partial<PlayerClient>, PlayerClient | null>(
      `players/${id}`,
      partialPlayer,
    );
  }

  // players$ = signal<TCaptain[]>([]);
  // // players = new BehaviorSubject<TCaptain[]>([]);
  // // players$ = new Subject<TCaptain[]>([]);

  // choosenCaptains_s$ = signal<TCaptainSelected[]>([]);
  // availableTeams$ = computed(() => {
  //   console.log(TEAMS, this.choosenCaptains_s$());
  //   return TEAMS.filter(
  //     (team) =>
  //       !this.choosenCaptains_s$()
  //         .map(({ team }) => team)
  //         .includes(team)
  //   );
  // });

  // captains$ = computed(() => {
  //   return this.players$().filter(({ captain }) => captain);
  // });

  // captainsToAdd$ = computed(() => {
  //   return this.players$().filter(
  //     ({ id }) => !this.captains$().find((captain) => captain.id === id)
  //   );
  // });

  // constructor() {
  //   this.init();
  // }

  // init() {
  //   this.getCaptains();
  // }

  // async getCaptains___() {
  //   const captains = await getCaptainsListMock();
  //   console.log(captains);
  //   if (captains?.length) {
  //     this.players$.update((prev) => [...prev, ...captains]);
  //     console.log('mutated');
  //   }
  //   console.log(this.players$());
  // }

  // toggleChoosenCaptains(id: string, team: string) {
  //   const hasCaptain = this.choosenCaptains_s$().find(
  //     (captain) => captain.id === id
  //   );

  //   if (hasCaptain) {
  //     this.choosenCaptains_s$.mutate((prev) =>
  //       prev.filter((captain) => captain.id !== id)
  //     );
  //   } else {
  //     const find = this.players$().find((captain) => captain.id === id);

  //     find &&
  //       this.choosenCaptains_s$.update((prev) => [...prev, { ...find, team }]);
  //   }
  // }

  // removeCaptain(id: string) {
  //   this.choosenCaptains_s$.update((prev) =>
  //     prev.filter((captain) => captain.id !== id)
  //   );
  // }

  // addCaptain(id: string) {
  //   this.players$.update((prev) =>
  //     prev.map((captain) => {
  //       if (captain.id === id) {
  //         return {
  //           ...captain,
  //           captain: true,
  //         };
  //       }
  //       return captain;
  //     })
  //   );
  // }
}
