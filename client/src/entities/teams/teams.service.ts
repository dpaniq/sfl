import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ITeamDTO } from '@entities/games/types';
import { HttpService } from '@shared/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private readonly httpService = inject(HttpService);

  public find(filter?: Partial<ITeamDTO>): Observable<[ITeamDTO, ITeamDTO]> {
    return this.httpService.get<[ITeamDTO, ITeamDTO]>('teams', filter);
  }
}
