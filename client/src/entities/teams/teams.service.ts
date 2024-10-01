import { inject, Injectable, isDevMode } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

import { ITeamDTO } from '@entities/games/types';
import { HttpService } from '@shared/services/http.service';
import { EnumTeamColor } from './constants';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private readonly httpService = inject(HttpService);

  public find(filter?: Partial<ITeamDTO>): Observable<[ITeamDTO, ITeamDTO]> {
    if (false && isDevMode()) {
      return of([
        {
          id: 'bmw',
          name: 'BMW',
          color: EnumTeamColor.White,
          description: 'BMW TEAM',
        },
        {
          id: 'honda',
          name: 'HONDA',
          color: EnumTeamColor.Red,
          description: 'HONDA TEAM',
        },
      ] as [ITeamDTO, ITeamDTO]);
    }

    const teams = this.httpService.get<[ITeamDTO, ITeamDTO]>('teams', filter);

    return teams.pipe(tap(teams => console.log('tap teams: ', teams)));
  }
}
