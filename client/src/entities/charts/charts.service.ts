import { inject, Injectable } from '@angular/core';
import { HttpService } from '@shared/services/http.service';
import { map, Observable } from 'rxjs';

export type TPlayersAncientRatingSystemTotalPoints = {
  id: string;
  nickname: string;
  user: {
    name?: string;
    surname?: string;
    email?: string;
  };
  ancientRatingSystem: {
    plusMinus: number;
    lastResult: number;
    totalPoints: number;
  };
};

@Injectable()
export class ChartsService {
  private readonly httpService = inject(HttpService);

  public getPlayersAncientRatingSystemBySeason(
    season: number,
  ): Observable<TPlayersAncientRatingSystemTotalPoints[]> {
    return this.httpService
      .get<
        TResponse<TPlayersAncientRatingSystemTotalPoints[]>
      >(`charts/players-ancient-rating-system-by-season/${season}`)
      .pipe(map(({ data }) => data));
  }
}
