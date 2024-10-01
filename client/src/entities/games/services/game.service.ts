import { Injectable, inject, isDevMode } from '@angular/core';
import { EnumTeamColor } from '@entities/teams/constants';
import { HttpService } from '@shared/services/http.service';
import { Observable, of } from 'rxjs';
import { EnumGameStatus } from '../constants';
import { IGameDTO } from '../types';

// ts-ignore
// eslint-ignore
const gameMock: IGameDTO = {
  number: 1,
  season: 2024,
  id: '65fd90ce89b1f2372c09622e',
  playedAt: '2023-11-04T00:00:00.000Z' as unknown as Date,
  createdAt: '2024-04-23T18:19:03.343Z' as unknown as Date,
  updatedAt: '2024-04-23T18:19:03.343Z' as unknown as Date,
  status: EnumGameStatus.Draft,
  teams: [
    {
      id: 'bmw',
      name: 'BMW',
      color: EnumTeamColor.White,
      description: '',
      logo: null,
    },
    {
      id: 'honda',
      name: 'HONDA',
      color: EnumTeamColor.Red,
      description: '',
      logo: null,
    },
  ],
  statistics: [
    {
      playerId: '658ddee2f71a72e6d8ea95fc',
      teamId: 'bmw',
      goal: 0,
      goalHead: 0,
      autoGoal: 0,
      penalty: 1,
      pass: 6,
      isCaptain: true,
      isMVP: false,
      isTransferable: true,
    },
    {
      playerId: '658ddee2f71a72e6d8ea9608',
      teamId: 'honda',
      goal: 0,
      goalHead: 0,
      autoGoal: 1,
      penalty: 0,
      pass: 0,
      isMVP: false,
      isTransferable: true,
      isCaptain: true,
    },
    {
      playerId: '658ddee2f71a72e6d8ea960e',
      teamId: 'bmw',
      goal: 1,
      goalHead: 0,
      autoGoal: 0,
      penalty: 0,
      pass: 0,
      isMVP: false,
      isTransferable: true,
      isCaptain: false,
    },
    {
      playerId: '658ddee2f71a72e6d8ea9614',
      teamId: 'bmw',
      goal: 0,
      goalHead: 1,
      autoGoal: 0,
      penalty: 0,
      pass: 0,
      isMVP: false,
      isTransferable: true,
      isCaptain: false,
    },
    {
      playerId: '658ddee2f71a72e6d8ea961a',
      teamId: 'bmw',
      goal: 0,
      goalHead: 0,
      autoGoal: 1,
      penalty: 0,
      pass: 0,
      isMVP: false,
      isTransferable: true,
      isCaptain: false,
    },
    {
      playerId: '658ddee2f71a72e6d8ea9620',
      teamId: 'honda',
      goal: 0,
      goalHead: 1,
      autoGoal: 0,
      penalty: 0,
      pass: 0,
      isMVP: false,
      isTransferable: true,
      isCaptain: false,
    },
    {
      playerId: '658ddee2f71a72e6d8ea9626',
      teamId: 'honda',
      goal: 1,
      goalHead: 0,
      autoGoal: 0,
      penalty: 0,
      pass: 0,
      isMVP: false,
      isTransferable: true,
      isCaptain: false,
    },
    {
      playerId: '658ddee2f71a72e6d8ea962c',
      teamId: 'honda',
      goal: 0,
      goalHead: 0,
      autoGoal: 0,
      penalty: 1,
      pass: 1,
      isMVP: false,
      isTransferable: true,
      isCaptain: false,
    },
  ],
};

@Injectable()
export class GameService {
  private readonly httpService = inject(HttpService);

  public find(filter: Partial<IGameDTO> = {}): Observable<IGameDTO[]> {
    return this.httpService.get<IGameDTO[]>('games', filter);
  }

  public findById(id: string): Observable<IGameDTO> {
    if (false && isDevMode()) {
      return of(gameMock);
    }

    return this.httpService.get<IGameDTO>(`games/${id}`);
  }

  public save(game: IGameDTO) {
    return this.httpService.post<IGameDTO>(`games`, game);
  }

  public resave(id: string, game: IGameDTO) {
    return this.httpService.put<IGameDTO>(`games/${id}`, game);
  }
}
