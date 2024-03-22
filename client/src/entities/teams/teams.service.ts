import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '@shared/services/http.service';
import { ITeam } from './types';

const URL_PREFIX = 'teams';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private readonly httpService = inject(HttpService);

  public find(filter?: Partial<ITeam>): Observable<ITeam[]> {
    return this.httpService.get<ITeam[]>(URL_PREFIX, filter);
  }
}
