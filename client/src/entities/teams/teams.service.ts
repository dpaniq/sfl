import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ITeamDTO } from '@entities/games/types';
import { HttpService } from '@shared/services/http.service';
import { EnumTeamColor } from './constants';

const URL_PREFIX = 'teams';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private readonly httpService = inject(HttpService);

  public find(filter?: Partial<ITeamDTO>): Observable<ITeamDTO[]> {
    return this.httpService.get<ITeamDTO[]>(URL_PREFIX, filter);
  }

  public findMock(): Observable<[ITeamDTO, ITeamDTO]> {
    return of([
      {
        _id: 'bmw',
        name: 'BMW',
        color: EnumTeamColor.White,
        description: 'BMW TEAM',
      },
      {
        _id: 'honda',
        name: 'HONDA',
        color: EnumTeamColor.Red,
        description: 'HONDA TEAM',
      },
    ]);
  }
}
